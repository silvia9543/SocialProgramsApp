package com.controller

import com.models.Address
import com.models.AddressRequest
import com.services.AddressService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/v1/api")
@CrossOrigin(origins = ["*"])
class AddressController {
    @Autowired
    lateinit var addressService: AddressService

    @GetMapping("getAllAddresses")
    fun getAllAddresses(): List<Address>? {
        return addressService.retrieveAllAddresses()
    }

    @PostMapping("/findAddresses")
    fun findAddresses(@RequestBody request: AddressRequest) : List<Address>?{
        return addressService.findPrograms(request.address, request.distance)
    }

    @PutMapping("/addresses/{id}")
    fun updateAddress(
            @PathVariable id: Long,
            @RequestBody updatedAddress: Address

    ): ResponseEntity<Address> {
        val savedAddress = addressService.updateAddress(updatedAddress, id)
        return ResponseEntity.ok(savedAddress)
    }

    @PostMapping("/addresses")
    fun addAddress(@RequestBody newAddress: Address): ResponseEntity<Address> {
        return try {
            val savedAddress = addressService.saveAddress(newAddress.address, newAddress.description)
            return ResponseEntity.ok(savedAddress)
        } catch (e: Exception) {
            println("Error adding address: ${e.message}")
            ResponseEntity.status(500).build()
        }
    }

    @DeleteMapping("/addresses/{id}")
    fun deleteAddress(@PathVariable id: Long): ResponseEntity<String> {
        return if (addressService.deleteAddressById(id)) {
            // Successfully deleted
            ResponseEntity.ok("Address with id $id deleted successfully.")
        } else {
            // Deletion failed
            ResponseEntity.status(500).body("Failed to delete address with id $id.")
        }
    }
}