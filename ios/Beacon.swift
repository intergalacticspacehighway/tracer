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
    
    let localBeaconUUID = uuid
    let localBeaconMajor: CLBeaconMajorValue = 123
    let localBeaconMinor: CLBeaconMinorValue = 456
    
    let uuid = UUID(uuidString: localBeaconUUID)!
    localBeacon = CLBeaconRegion(proximityUUID: uuid, major: localBeaconMajor, minor: localBeaconMinor, identifier: "abcd")
    
    beaconPeripheralData = localBeacon.peripheralData(withMeasuredPower: -59)
    
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
  
  
  @objc
  func stopScanning() {
    manager?.stopScan();
    
  }
  
  func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
    if peripheral.state == .poweredOn {
      if !peripheralManager.isAdvertising {
        peripheralManager.startAdvertising(beaconPeripheralData as? [String: Any])
      }
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
    
   
      peripherals.append(peripheral)
      print(peripheral.state)
      print(RSSI)
      print(advertisementData)
      
      if let dta = advertisementData["kCBAdvDataManufacturerData"] as? Data
      {
        print(dta.hexEncodedString())
        let data = dta.hexEncodedString();
        //          let uuid = data.substring(with: Range.)(from: 8 , to:40);
        let uuid = data[8..<40];
        
        
        print("receiving uuid ", uuid);
        //          let uuid = 004c0215848da4e8079358138a36a57ac46486e800010002c5
        sendEvent(withName: "onScanResult", body:
          [
            
            "rssi":RSSI,
            "deviceId":uuid
            
        ])
      }
      
      
    
    
  }
  
  func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
    
    sendEvent(withName: "onBroadcastSuccess", body:
      [
        "message":"Broadcast success",
    ]);
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
    
    //          DispatchQueue.main.asyncAfter(deadline: .now() + 60.0) {
    //              self.stopScanForBLEDevice()
    //          }
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

extension Data {
  struct HexEncodingOptions: OptionSet {
    let rawValue: Int
    static let upperCase = HexEncodingOptions(rawValue: 1 << 0)
  }
  
  func hexEncodedString(options: HexEncodingOptions = []) -> String {
    let format = options.contains(.upperCase) ? "%02hhX" : "%02hhx"
    var finalArr = map { String(format: format, $0) }
    
    //      if finalArr.count > 19
    //      {
    //        finalArr = finalArr.dropLast(5)
    //      }
    
    
    return finalArr.joined()
  }
}

extension String {
  subscript(_ range: CountableRange<Int>) -> String {
    let start = index(startIndex, offsetBy: max(0, range.lowerBound))
    let end = index(start, offsetBy: min(self.count - range.lowerBound,
                                         range.upperBound - range.lowerBound))
    return String(self[start..<end])
  }
  
  subscript(_ range: CountablePartialRangeFrom<Int>) -> String {
    let start = index(startIndex, offsetBy: max(0, range.lowerBound))
    return String(self[start...])
  }
}
