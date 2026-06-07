package vn.edu.fpt.analyticsservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.edu.fpt.analyticsservice.model.TrackingEvent;
import vn.edu.fpt.analyticsservice.repository.TrackingEventRepository;

@Service
public class AnalyctisService {
    @Autowired
    private TrackingEventRepository trackingEventRepository;
    public List<TrackingEvent> findAll(int limit, int offset) {
        return trackingEventRepository.getRawTrackingEvents( limit, offset);
    }
}
