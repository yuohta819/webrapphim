package vn.edu.fpt.ticketservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import vn.edu.fpt.ticketservice.dto.MovieTicketSalesDTO;
import vn.edu.fpt.ticketservice.model.Ticket;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    Ticket findByTicketIdAndIsDeleted(String ticketId, Boolean isDeleted);

    List<Ticket> findByIsDeletedFalse();

    @Aggregation(pipeline = {
            "{ $group: { _id: { movieId: '$movieId', movieTitle: '$movieTitle' }, ticketCount: { $sum: 1 } } }",
            "{ $project: { _id: 0, movieId: '$_id.movieId', movieTitle: '$_id.movieTitle', ticketCount: 1 } }",
            "{ $sort: { ticketCount: -1 } }"
    })
    List<MovieTicketSalesDTO> countTicketsByMovie();

    @Query(value = "{ 'isDeleted' : false }", count = true)
    Long countActiveTickets();
}
