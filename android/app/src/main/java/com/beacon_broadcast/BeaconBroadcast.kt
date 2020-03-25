package com.beacon_broadcast

import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseSettings
import android.content.Context
import com.facebook.react.bridge.ReadableMap
import org.altbeacon.beacon.Beacon
import org.altbeacon.beacon.BeaconParser
import org.altbeacon.beacon.BeaconTransmitter
import org.altbeacon.beacon.BeaconTransmitter.checkTransmissionSupported
import java.util.*

const val RADIUS_NETWORK_MANUFACTURER = 0x0118

public class BeaconData {
    public var layout = BeaconParser.ALTBEACON_LAYOUT;
    public var uuid: String = "CDB7950D-73F1-4D4D-8E47-C090502DBD63"
    public var majorId: Int = 1
    public var minorId: Int = 100
    public var transmissionPower: Int = -59
    public var manufacturerId: Int = 0

    constructor(map: ReadableMap) {
        if(map.hasKey("uuid")) {
            this.uuid = map.getString("uuid").toString()
        }
        if(map.hasKey("majorId")) {
            this.majorId = map.getInt("majorId")
        }
        if(map.hasKey("minorId")) {
            this.minorId = map.getInt("minorId")
        }

        if(map.hasKey("transmissionPower")) {
            this.transmissionPower = map.getInt("transmissionPower")
        }

        if(map.hasKey("manufacturerId")) {
            this.manufacturerId = map.getInt("manufacturerId")
        }

        if(map.hasKey("layout")) {
            this.layout = map.getString("layout").toString()
        }
   }

}

class BeaconBroadcast {

    private lateinit var context: Context
    private var beaconTransmitter: BeaconTransmitter? = null

    fun init(context: Context) {
        this.context = context
    }

    fun start(beaconData: BeaconData) {

        if (isTransmissionSupported() == 0) {
            val beaconParser = BeaconParser().setBeaconLayout(beaconData.layout ?: BeaconParser.ALTBEACON_LAYOUT)
            beaconTransmitter = BeaconTransmitter(context, beaconParser)
        }

        val beacon = Beacon.Builder()
                .setId1(beaconData.uuid)
                .setId2(beaconData.majorId.toString())
                .setId3(beaconData.minorId.toString())
                .setTxPower(beaconData.transmissionPower ?: -59)
                .setDataFields(Arrays.asList(0L))
                .setManufacturer(beaconData.manufacturerId ?: RADIUS_NETWORK_MANUFACTURER)
                .build()


        beaconTransmitter?.startAdvertising(beacon)
    }

    fun isAdvertising(): Boolean {
        return beaconTransmitter?.isStarted ?: false
    }

    fun isTransmissionSupported(): Int {
        return checkTransmissionSupported(context)
    }

    fun stop() {
        beaconTransmitter?.stopAdvertising()
        advertiseCallback?.invoke(false)
    }

}