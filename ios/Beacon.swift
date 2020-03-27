//
//  Beacon.swift
//  tracer
//
//  Created by stl-037 on 26/03/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import CoreBluetooth
import CoreLocation
import UIKit



@objc(Beacon)
class Beacon:  RCTEventEmitter,CBPeripheralManagerDelegate,CBCentralManagerDelegate
{
  
  
  var localBeacon: CLBeaconRegion!
  var beaconPeripheralData: NSDictionary!
  var peripheralManager: CBPeripheralManager!
  var peripherals:[CBPeripheral] = []
    var manager: CBCentralManager? = nil
  
  @objc
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  
  @objc(startBroadcast:)
  func startBroadcast(uuid: String) -> Void
  {
    
    manager = CBCentralManager(delegate: self, queue: nil)
    





    if localBeacon != nil {
        stopBroadcast()
    }

    let localBeaconUUID = "CDB7950D-73F1-4D4D-8E47-C090502DBD63"
    let localBeaconMajor: CLBeaconMajorValue = 123
    let localBeaconMinor: CLBeaconMinorValue = 456

    let uuid = UUID(uuidString: localBeaconUUID)!
    localBeacon = CLBeaconRegion(proximityUUID: uuid, major: localBeaconMajor, minor: localBeaconMinor, identifier: "abcd")

    beaconPeripheralData = localBeacon.peripheralData(withMeasuredPower: nil)
    peripheralManager = CBPeripheralManager(delegate: self, queue: nil, options: nil)
    print("uuid ", uuid)
  }
  
  @objc
  func stopBroadcast() {
      peripheralManager.stopAdvertising()
      peripheralManager = nil
      beaconPeripheralData = nil
      localBeacon = nil
  }

  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
      if peripheral.state == .poweredOn {
          peripheralManager.startAdvertising(beaconPeripheralData as? [String: Any])
      } else if peripheral.state == .poweredOff {
          peripheralManager.stopAdvertising()
      }
  }
//  centralManagerDidUpdateStat
  func updateDistance(_ distance: CLProximity)
  {
      
      print(distance)
  }
  func stopScanForBLEDevice(){
      manager?.stopScan()
      print("scan stopped")
  }
  //CBCentralMaganerDelegate code
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
    
      if (!peripherals.contains(peripheral))
      {
          peripherals.append(peripheral)
        print(peripheral.state)
        print(RSSI)
        print(advertisementData)
        if let serviceUUIDs = advertisementData["kCBAdvDataServiceUUIDs"] as? NSArray
        {
          if serviceUUIDs.count > 0
          {
            ///
              sendEvent(withName: "onScanResult", body: [
              "rssi":RSSI,
              "deviceId":serviceUUIDs[0]
                
              ])
          }
          
        }
        
        
        
      }
    
      
      }
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
      print(central.state)
    if central.state == .poweredOn
    {
      if !(central.isScanning) {
        manager?.scanForPeripherals(withServices: nil, options: [CBCentralManagerScanOptionAllowDuplicatesKey : true])
//        DispatchQueue.main.asyncAfter(deadline: .now() + 60.0) {
//            self.stopScanForBLEDevice()
//        }
      }
      
    }
    
  }
  @objc(startScanning:)
  func startScanning(uuid: String) -> Void
  {
    manager?.scanForPeripherals(withServices: nil, options: nil)

          DispatchQueue.main.asyncAfter(deadline: .now() + 60.0) {
              self.stopScanForBLEDevice()
          }
      print("uuid ", uuid)
   }

  @objc(supportedEvents)
  override public func supportedEvents() -> [String] {
      return [
          "onScanResult",
          "onScanResultBulk",
          "onScanFailed",
          "onBroadcastSuccess",
          "onBroadcastFailure",
          "onStopScanning",
          "onStopBroadcast"
          
               ]
  }
}
