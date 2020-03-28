package com.tracer;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.Intent;
import android.os.Build;
import android.os.ParcelUuid;
import android.util.Log;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.altbeacon.beacon.Beacon;
import org.altbeacon.beacon.BeaconParser;
import org.altbeacon.beacon.BeaconTransmitter;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;
import java.util.UUID;

public class BeaconModule extends ReactContextBaseJavaModule {
    private static final char[] HEX = "0123456789ABCDEF".toCharArray();
    BeaconParser parser = new  BeaconParser().setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24");

    //constructor
    public BeaconModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    //Mandatory function getName that specifies the module name
    @Override
    public String getName() {
        return "Beacon";
    }


    @ReactMethod
    public void stopBroadcast() {
        Log.i("BLE","stopping broadcast");
        Intent serviceIntent = new Intent(getReactApplicationContext(), BeaconTransmitterService.class);

        getReactApplicationContext().stopService(serviceIntent);
        String text = "Stopping Broadcast";
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
        toast.show();



    }

    @ReactMethod
    public void stopScanning() {
        BluetoothLeScanner mBluetoothLeScanner = BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner();
        mBluetoothLeScanner.stopScan(mScanCallback);
        String text = "Scanning has been stopped";
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
        toast.show();


    }

    @ReactMethod
    public void startBroadcast(final String uuid) {
        boolean isBluetoothEnabled = verifyIfBluetoothIsEnabled();
        if(!isBluetoothEnabled) {
            return;
        }

        try {
            Log.i("BLE ",uuid);
            ParcelUuid pUuid = new ParcelUuid(UUID.fromString(uuid));

            int result = BeaconTransmitter.checkTransmissionSupported(getReactApplicationContext());
            if(result == BeaconTransmitter.SUPPORTED) {
                Intent serviceIntent = new Intent(getReactApplicationContext(), BeaconTransmitterService.class);
                serviceIntent.putExtra("uuid", uuid);
                ContextCompat.startForegroundService(getReactApplicationContext(), serviceIntent);

            }

        } catch (Exception e) {
            Log.i("BLE",e.getMessage());
            e.printStackTrace();
        }
    }


        boolean verifyIfBluetoothIsEnabled() {
            BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            if (mBluetoothAdapter == null) {
                String text = "Device does not support bluetooth";
                int duration = Toast.LENGTH_SHORT;
                Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
                toast.show();
                return false;
            }

            if (!mBluetoothAdapter.isEnabled()) {
                String text = "Please enable Bluetooth and try again";
                int duration = Toast.LENGTH_SHORT;
                Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
                toast.show();
                return false;
            }

            return true;
    }

        @ReactMethod
    public void startScanning(final String uuid) {

                boolean isBluetoothEnabled = verifyIfBluetoothIsEnabled();
                if(!isBluetoothEnabled) {
                    return;
                }

                String text = "Scanning for Nearby";
                int duration = Toast.LENGTH_SHORT;
                Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
                toast.show();


            BluetoothLeScanner mBluetoothLeScanner = BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner();
//        ScanFilter filter = new ScanFilter.Builder()
//                .setServiceUuid(new ParcelUuid(UUID.fromString(uuid)))
//                .build();


        ScanSettings settings = new ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .build();

        Log.i("BLE", "starting scanning");


        mBluetoothLeScanner.startScan(mScanCallback);

    }



    AdvertiseCallback advertisingCallback = new AdvertiseCallback() {
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            Log.i("BLE", "Advertising onStartSuccess " + settingsInEffect);
            ReactContext currentContext = getReactApplicationContext();

            WritableMap params = Arguments.createMap();
            params.putInt("txPowerLevel", settingsInEffect.getTxPowerLevel());
            params.putInt("mode", settingsInEffect.getMode());

            currentContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onBroadcastSuccess", params);

            super.onStartSuccess(settingsInEffect);
        }

        @Override
        public void onStartFailure(int errorCode) {
            Log.e("BLE", "Advertising onStartFailure: " + errorCode);

            WritableMap params = Arguments.createMap();
            params.putInt("error", errorCode);
            ReactContext currentContext = getReactApplicationContext();

            currentContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onBroadcastFailure", params);

            super.onStartFailure(errorCode);
        }
    };

    ScanCallback mScanCallback = new ScanCallback() {

        WritableMap getReadableMap(ScanResult result) {

            WritableMap params = Arguments.createMap();

            Beacon beacon = parser.fromScanData(result.getScanRecord().getBytes(), result.getRssi(), result.getDevice());
            if(beacon != null) {

            String deviceId = beacon.getIdentifier(0).toString();
            double distance = beacon.getDistance();
            Log.i("BLE", String.valueOf(distance) + " "+ deviceId);
            params.putString("deviceId", deviceId);
            params.putInt("rssi", result.getRssi());

            params.putDouble("distance", distance);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                int txPower = result.getTxPower();
                params.putInt("txPower", txPower);
            }

            } else {
                Log.i("BLE", "beacon nil");

            }

            return params;

        }

        public void onScanResult(int callbackType, ScanResult result) {
            if (result == null || result.getDevice() == null){
                return;

            }

              WritableMap  params = this.getReadableMap(result);


            ReactContext currentContext = getReactApplicationContext();
            currentContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onScanResult", params);

            }

//        }

        @Override
        public void onBatchScanResults(List<ScanResult> results) {
            Log.i("BLE", "Batch results "+results);
            WritableArray params = Arguments.createArray();
            for(ScanResult result : results) {
                WritableMap map = this.getReadableMap(result);
                params.pushMap(map);
            }

            ReactContext currentContext = getReactApplicationContext();

            currentContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onScanResultBulk", params);


        }

        @Override
        public void onScanFailed(int errorCode) {
            if(errorCode == ScanCallback.SCAN_FAILED_ALREADY_STARTED) {
                String text = "Scan is already in progress";
                int duration = Toast.LENGTH_SHORT;
                Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
                toast.show();

            } else if(errorCode == ScanCallback.SCAN_FAILED_FEATURE_UNSUPPORTED) {
                String text = "Scan BLE emitters is not supported by this device";
                int duration = Toast.LENGTH_SHORT;
                Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
                toast.show();

            }


            WritableMap params = Arguments.createMap();
            params.putInt("error", errorCode);
            ReactContext currentContext = getReactApplicationContext();

            currentContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onScanFailed", params);

            Log.e("BLE", "Discovery onScanFailed: " + errorCode);
        }
    };


}