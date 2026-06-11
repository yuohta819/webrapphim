/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const localUsers = localStorage.getItem('users');
    if (localUsers) return JSON.parse(localUsers);
    localStorage.setItem('users', JSON.stringify(initialUsers));
    return initialUsers;
  });

  const [authUser, setAuthUser] = useState(() => {
    const localAuthUser = localStorage.getItem('authUser');
    return localAuthUser ? JSON.parse(localAuthUser) : null;
  });

  // Track simulated email verification codes
  const [verificationCodes, setVerificationCodes] = useState({});

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('authUser', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [authUser]);

  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error("Email không tồn tại trong hệ thống.");
    }
    if (user.password !== password) {
      throw new Error("Mật khẩu không chính xác.");
    }
    if (user.status === 'blocked') {
      throw new Error("Tài khoản của bạn đã bị khóa bởi quản trị viên.");
    }
    if (user.status === 'pending') {
      throw new Error("Tài khoản chưa được xác nhận email. Hãy hoàn tất xác nhận.");
    }

    setAuthUser(user);
    return user;
  };

  const register = (email, name, password) => {
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error("Email này đã được đăng ký.");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerificationCodes(prev => ({ ...prev, [email.toLowerCase()]: code }));

    // Simulate sending email to console
    console.log(`[CineLuxe Simulation] Verification code for ${email} is: ${code}`);

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password,
      role: "user",
      status: "pending" // requires email verification
    };

    setUsers(prev => [...prev, newUser]);
    return { email, code };
  };

  const verifyEmail = (email, code) => {
    const actualCode = verificationCodes[email.toLowerCase()];
    if (!actualCode || actualCode !== code) {
      throw new Error("Mã xác thực không hợp lệ hoặc đã hết hạn.");
    }

    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return { ...u, status: "active" };
      }
      return u;
    }));

    // Clean up code
    setVerificationCodes(prev => {
      const copy = { ...prev };
      delete copy[email.toLowerCase()];
      return copy;
    });
  };

  const logout = () => {
    setAuthUser(null);
  };

  const updateUserStatus = (userId, status) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, status };
        // If current logged-in user is updated, update local state too
        if (authUser && authUser.id === userId) {
          if (status === 'blocked') {
            setAuthUser(null);
          } else {
            setAuthUser(updated);
          }
        }
        return updated;
      }
      return u;
    }));
  };

  return (
    <AuthContext.Provider value={{
      users,
      authUser,
      login,
      register,
      verifyEmail,
      logout,
      updateUserStatus,
      verificationCodes // exposed for demo verification screen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
