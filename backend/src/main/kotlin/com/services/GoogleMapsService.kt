package com.services
import com.google.maps.GeoApiContext
import com.google.maps.GeocodingApi
import com.google.maps.model.GeocodingResult
import org.springframework.stereotype.Service
import java.sql.DriverManager.println

@Service
class GoogleMapsService(
        private val geoApiContext: GeoApiContext // Injecting GeoApiContext created by the configuration class
) {
    // Method to geocode an address
    fun geocodeAddress(address: String): Array<GeocodingResult>? {
        return try {
            GeocodingApi.geocode(geoApiContext, address).await()  // Use the injected GeoApiContext
        } catch (e: Exception) {
            println("Error occurred during geocoding: ${e.message}")
            null
        }
    }
}
