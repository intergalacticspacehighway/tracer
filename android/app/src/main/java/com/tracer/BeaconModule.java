package com.tracer;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.ParcelUuid;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.nio.charset.Charset;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class BeaconModule extends ReactContextBaseJavaModule {

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
    public void startBroadcast(final String uuid, final String deviceId) {

        try {
            Log.i("BLE ",uuid);
            ParcelUuid pUuid = new ParcelUuid(UUID.fromString(uuid));

            AdvertiseData data = new AdvertiseData.Builder()
                    .addServiceUuid(pUuid)
                    .addManufacturerData(1, deviceId.getBytes())
                    .build();


            BluetoothLeAdvertiser advertiser = BluetoothAdapter.getDefaultAdapter().getBluetoothLeAdvertiser();
            AdvertiseSettings settings = new AdvertiseSettings.Builder()
                    .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                    .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_LOW)
                    .setConnectable(false)
                    .build();

            advertiser.startAdvertising(settings, data, advertisingCallback);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    @ReactMethod
    public void startScanning(final String uuid) {

         Handler mHandler = new Handler();

        BluetoothLeScanner mBluetoothLeScanner = BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner();
        ScanFilter filter = new ScanFilter.Builder()
                .setServiceUuid(new ParcelUuid(UUID.fromString(uuid)))
                .build();


        ScanSettings settings = new ScanSettings.Builder()
                .setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY)
                .build();

        Log.i("BLE", "starting scanning");


        mBluetoothLeScanner.startScan(Collections.singletonList(filter), settings, mScanCallback);
    }


    AdvertiseCallback advertisingCallback = new AdvertiseCallback() {
        @Override
        public void onStartSuccess(AdvertiseSettings settingsInEffect) {
            Log.i("BLE", "Advertising onStartSuccess " + settingsInEffect);

            super.onStartSuccess(settingsInEffect);
        }

        @Override
        public void onStartFailure(int errorCode) {
            Log.e("BLE", "Advertising onStartFailure: " + errorCode);
            super.onStartFailure(errorCode);
        }
    };

    ScanCallback mScanCallback = new ScanCallback() {
        @RequiresApi(api = Build.VERSION_CODES.O)
        public void onScanResult(int callbackType, ScanResult result) {
            String deviceId = new String(result.getScanRecord().getManufacturerSpecificData(1));
            Log.i("BLE", "On ScaN Result " +deviceId );
//            System.out.println("Power " + result.getRssi()+" : "+ result.getScanRecord().getTxPowerLevel()+": "+result.getTxPower() );
            double distance = calculateAccuracy(-59,result.getRssi());
            System.out.println("Distance "+distance);

            if (result == null
                    || result.getDevice() == null)
                return;
        }

        @Override
        public void onBatchScanResults(List<ScanResult> results) {
            Log.i("BLE", "Batch results "+results);
        }

        @Override
        public void onScanFailed(int errorCode) {
            Log.e("BLE", "Discovery onScanFailed: " + errorCode);
        }
    };

    protected static double calculateAccuracy(int txPower, int rssi) {
        return Math.pow(10d, ((double) txPower - rssi) / (10 * 2));
    }

}