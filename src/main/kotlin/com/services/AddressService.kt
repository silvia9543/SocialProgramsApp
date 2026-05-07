package com.services

import com.services.GoogleMapsService
import com.google.maps.model.GeocodingResult
import com.models.Address
import com.models.Coordinates
import com.repository.AddressRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.sql.DriverManager.println

@Service
class AddressService (
    private val addressRepo : AddressRepository,
    private val googleMapsService : GoogleMapsService,
    private val s2GeometryService: S2GeometryService
) {

    fun findPrograms(address : String, miles : Double) : List<Address> {
        val coordinates = convertAddressToCoordinates(address)
        //var cellIds: List<Long>? = null
        if (coordinates != null) {
            var allAddresses = retrieveAllAddresses()
            if (allAddresses != null) {
                var programs = s2GeometryService.getCellIdsWithinRadius(coordinates.latitude, coordinates.longitude, miles, allAddresses.filter {it.address != address})
                return programs
            }
        }
        return emptyList()
    }

    fun retrieveAllAddresses() : List<Address>? {
        return addressRepo.findAll();
    }

    fun saveAddress(address : String, description : String) : Address? {
        val coordinates = convertAddressToCoordinates(address)
        if (coordinates != null) {
            try {
                var cellId = s2GeometryService.getS2CellIdString(coordinates.latitude, coordinates.longitude)
                var addressEntity = Address(address = address, cellId = cellId, description = description)
                return addressRepo.save(addressEntity)
            } catch (err: Exception) {
                println("Error saving address: ${err.message}")
            }
        }
        return null
    }

    fun convertAddressToCoordinates(address : String): Coordinates? {
        return try {
            val results: Array<GeocodingResult>? = googleMapsService.geocodeAddress(address)

            if (results != null) { //add a not empty check
                val lat = results[0].geometry.location.lat
                val lng = results[0].geometry.location.lng
                Coordinates(lat, lng)
            } else {
                null
            }
        } catch (e: Exception) {
            println("Error during geocoding: ${e.message}")
            null
        }
    }

    fun updateAddress(addressEntity: Address, addressId: Long): Address {
        // Fetch the managed entity from the DB
        val existingAddress = addressRepo.findById(addressId)
                .orElseThrow { EntityNotFoundException("Address not found") }

        // Update fields
        existingAddress.address = addressEntity.address
        existingAddress.description = addressEntity.description

        val coordinates = convertAddressToCoordinates(addressEntity.address)
        if (coordinates != null) {
            try {
                existingAddress.cellId = s2GeometryService.getS2CellIdString(coordinates.latitude, coordinates.longitude)
            } catch (err: Exception) {
                println("Error computing cellId: ${err.message}")
            }
        }

        // Save the managed entity — JPA knows it’s an update
        return addressRepo.save(existingAddress)
    }

    fun deleteAddressById(addressId : Long) : Boolean {
        try {
            addressRepo.deleteById(addressId)
            return true;
        } catch (err : Exception) {
            println("Error deleting id: ${err.message}")
            return false;
        }
    }
}