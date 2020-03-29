//
//  Beacon.m
//  tracer
//
//  Created by stl-037 on 26/03/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(Beacon, NSObject)
RCT_EXTERN_METHOD(startBroadcast:(NSString *)uuid)
RCT_EXTERN_METHOD(startScanning:(NSString *)uuid)
RCT_EXTERN_METHOD(stopScanning)
RCT_EXTERN_METHOD(stopBroadcast)
RCT_EXTERN_METHOD(detectBeacons)

@end
