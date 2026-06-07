package vn.edu.fpt.analyticsservice.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.edu.fpt.analyticsservice.model.TrackingEvent;
import vn.edu.fpt.analyticsservice.service.AnalyctisService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/analytics")
public class AnalysticController {
    @Autowired
    private AnalyctisService analyctisService;

    @GetMapping("/find-all")
    public ResponseEntity<List<TrackingEvent>> getMethodName(
            @RequestParam(name = "limit", defaultValue = "10") int limit,
            @RequestParam(name = "offset", defaultValue = "0") int offset) {
        return ResponseEntity.ok(analyctisService.findAll(limit, offset));
    }

}
