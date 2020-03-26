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
class Beacon: NSObject, CBPeripheralManagerDelegate,CBCentralManagerDelegate
{
  
  
  var localBeacon: CLBeaconRegion!
  var beaconPeripheralData: NSDictionary!
  var peripheralManager: CBPeripheralManager!
  var peripherals:[CBPeripheral] = []
    var manager: CBCentralManager? = nil
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  
  @objc(startBroadcast:)
  func startBroadcast(uuid: String) -> Void
  {
    
    manager = CBCentralManager(delegate: self, queue: nil)
    

    
    
    
    
    if localBeacon != nil {
        stopBroadcast()
    }

    let localBeaconUUID = "5A4BCFCE-174E-4BAC-A814-092E77F6B7E5"
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
        
      }
    
      
      }
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
      print(central.state)
    if central.state == .poweredOn
    {
      if !(central.isScanning) {
        manager?.scanForPeripherals(withServices: nil, options: [CBCentralManagerScanOptionAllowDuplicatesKey : true])
        DispatchQueue.main.asyncAfter(deadline: .now() + 60.0) {
            self.stopScanForBLEDevice()
        }
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
}
