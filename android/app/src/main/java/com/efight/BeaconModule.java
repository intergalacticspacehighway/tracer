package com.efight;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.util.Log;
import android.widget.Toast;
import androidx.core.content.ContextCompat;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


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
    public void stopBroadcast() {
        Log.i("BLE", "stopping broadcast");
        Intent serviceIntent = new Intent(getReactApplicationContext(), BeaconTransmitterService.class);
        getReactApplicationContext().stopService(serviceIntent);
    }

    @ReactMethod
    public void stopScanning() {
        Log.i("BLE", "stop Scanning");
        Intent serviceIntent = new Intent(getReactApplicationContext(), BeaconScannerService.class);
        getReactApplicationContext().stopService(serviceIntent);
    }


    @ReactMethod
    public void startScanning(final String uuid) {
        if (!verifyIfNecessaryResourcesAreEnabled()) {
            return;
        }

        Intent serviceIntent = new Intent(getReactApplicationContext(), BeaconScannerService.class);
        serviceIntent.putExtra("uuid", uuid);
        ContextCompat.startForegroundService(getReactApplicationContext(), serviceIntent);
    }

    @ReactMethod
    public void startBroadcast(final String uuid) {
        if (!verifyIfNecessaryResourcesAreEnabled()) {
            return;
        }
        Log.i("BLE ", uuid);
        Intent serviceIntent = new Intent(getReactApplicationContext(), BeaconTransmitterService.class);
        serviceIntent.putExtra("uuid", uuid);
        ContextCompat.startForegroundService(getReactApplicationContext(), serviceIntent);
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

    boolean verifyIfGPSIsEnabled() {
        LocationManager locationManager = (LocationManager) getReactApplicationContext().getSystemService(Context.LOCATION_SERVICE);

        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
            Log.i("BLE", "gps is enabled");
            return true;
        } else {
            showGPSDisabledAlertToUser();
            return false;
        }
    }

    boolean verifyIfNecessaryResourcesAreEnabled() {
        return verifyIfBluetoothIsEnabled() && verifyIfGPSIsEnabled();
    }

    private void showGPSDisabledAlertToUser() {
        String text = "Device GPS is disabled. Please enable it and try again.";
        int duration = Toast.LENGTH_SHORT;
        Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
        toast.show();


    }

}