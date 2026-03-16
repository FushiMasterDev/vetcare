package com.vetcare.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String shortDescription;
    private String imageUrl;
    private BigDecimal price;
    private Integer durationMinutes;

    @Column(nullable = false)
    private String specialization;

    @ElementCollection
    @CollectionTable(name = "service_symptoms", joinColumns = @JoinColumn(name = "service_id"))
    @Column(name = "symptom")
    @Builder.Default
    private List<String> symptoms = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @ManyToMany(mappedBy = "services")
    @Builder.Default
    private List<Doctor> doctors = new ArrayList<>();

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Appointment> appointments = new ArrayList<>();

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Review> reviews = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
