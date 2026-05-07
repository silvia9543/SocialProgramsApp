package com.models
import jakarta.persistence.*

@Entity
@Table(
        name = "addresses",
        uniqueConstraints = [UniqueConstraint(columnNames = ["cell_id", "address"])]
)
data class Address (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Column(name = "address", nullable=false)
    var address : String,
    @Column(name = "cell_id", nullable=false)
    var cellId: Long,
    @Column(name = "description", nullable=false)
    var description: String
) {
    constructor() : this(null, "", 0, "")
}