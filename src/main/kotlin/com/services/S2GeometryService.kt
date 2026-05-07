package com.services

import com.google.common.geometry.*
import com.models.Address
import org.springframework.stereotype.Service


@Service
class S2GeometryService {
    private val earthRadiusMiles = 3959;

    fun getS2CellIdString(latitude: Double, longitude: Double): Long {
        val latLng = S2LatLng.fromDegrees(latitude, longitude)
        return S2CellId.fromLatLng(latLng).id()
    }

    fun getS2CellId(latitude: Double, longitude: Double): S2CellId {
        val latLng = S2LatLng.fromDegrees(latitude, longitude)
        return S2CellId.fromLatLng(latLng)
    }

    fun getCellIdsWithinRadius(latitude: Double, longitude: Double, radiusInMiles: Double, allAddresses: List<Address> ) : List<Address> {
        val radians = radiusInMiles / earthRadiusMiles // convert miles distance to radians
        val s2CellId = getS2CellId(latitude, longitude) // get the cellId of our point
        var regionCoverer = S2RegionCoverer.builder()
                .setMinLevel(10)
                .setMaxLevel(20)
                .setMaxCells(500)
                .setLevelMod(1)
                .build();
        val cap = S2Cap.fromAxisHeight(s2CellId.toPoint(), radians) // get a cap (spherical disk) covering the area bound by radius
        val covering:S2CellUnion = regionCoverer.getCovering(cap) //get a cell union of all the cells in that cap
        var filteredAddresses = allAddresses.filter { covering.contains(S2CellId(it.cellId)) }; //return all addresses with cell Ids in the region covering
        val startingPoint = S2LatLng.fromDegrees(latitude, longitude) //get our starting point
        return filteredAddresses.filter { startingPoint.getDistance(S2LatLng.fromPoint(S2CellId(it.cellId).toPoint())) <= S1Angle.radians(radians) } //increase accuracy by calculating distance
    }
}