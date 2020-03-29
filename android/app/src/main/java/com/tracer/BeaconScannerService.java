package com.tracer;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanResult;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.altbeacon.beacon.Beacon;
import org.altbeacon.beacon.BeaconParser;

import java.util.List;

public class BeaconScannerService extends Service {
    public static final String CHANNEL_ID = "BeaconScannerServiceChannel";

    @Override
    public void onCreate() {
        super.onCreate();
    }

    BluetoothLeScanner mBluetoothLeScanner = BluetoothAdapter.getDefaultAdapter().getBluetoothLeScanner();

    BeaconParser beaconParser = new BeaconParser()
            .setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24");

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String uuid = intent.getStringExtra("uuid");
        createNotificationChannel();
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, notificationIntent, 0);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this, CHANNEL_ID);
        Notification notification = mBuilder
                .setContentTitle("Scanning nearby emitters")
                .setContentText("Scanning will run in background")
                .setSmallIcon(R.drawable.redbox_top_border_background)
                .setContentIntent(pendingIntent)
                .build();
        startForeground(2, notification);


        mBluetoothLeScanner.startScan(mScanCallback);


        return START_NOT_STICKY;
    }


    ReactContext getReactApplicationContext() {
        MainApplication application = (MainApplication) this.getApplication();

        ReactNativeHost reactNativeHost = application.getReactNativeHost();
        ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        return reactContext;
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        stopScanning();
        stopSelf();

        super.onTaskRemoved(rootIntent);
    }

    @Override
    public void onDestroy() {
        stopScanning();

        super.onDestroy();
    }

    void stopScanning() {
        if (this.mBluetoothLeScanner != null) {
            this.mBluetoothLeScanner.stopScan(mScanCallback);
            String text = "Stopping Scan";
            int duration = Toast.LENGTH_SHORT;
            Toast toast = Toast.makeText(getApplicationContext(), text, duration);
            toast.show();
            this.mBluetoothLeScanner = null;
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    ScanCallback mScanCallback = new ScanCallback() {

        WritableMap getReadableMap(Beacon beacon) {

            WritableMap params = Arguments.createMap();

            if (beacon != null) {

                String deviceId = beacon.getIdentifier(0).toString();
                double distance = beacon.getDistance();
                Log.i("BLE", String.valueOf(distance) + " " + deviceId);
                params.putString("deviceId", deviceId);
                params.putInt("rssi", beacon.getRssi());

                params.putDouble("distance", distance);

                int txPower = beacon.getTxPower();
                params.putInt("txPower", txPower);

            } else {
                Log.i("BLE", "beacon nil");

            }

            return params;

        }

        public void onScanResult(int callbackType, ScanResult result) {
            if (result == null || result.getDevice() == null) {
                return;
            }

            Beacon beacon = beaconParser.fromScanData(result.getScanRecord().getBytes(), result.getRssi(), result.getDevice());

            if (beacon == null) {
                return;
            }

            WritableMap params = this.getReadableMap(beacon);


            ReactContext currentContext = getReactApplicationContext();
            currentContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onScanResult", params);

        }

//        }

        @Override
        public void onBatchScanResults(List<ScanResult> results) {
            Log.i("BLE", "Batch results " + results);
            WritableArray params = Arguments.createArray();
            for (ScanResult result : results) {
                Beacon beacon = beaconParser.fromScanData(result.getScanRecord().getBytes(), result.getRssi(), result.getDevice());
                if (beacon != null) {
                    WritableMap map = this.getReadableMap(beacon);
                    params.pushMap(map);
                }
            }

            ReactContext currentContext = getReactApplicationContext();

            currentContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onScanResultBulk", params);


        }

        @Override
        public void onScanFailed(int errorCode) {
            if (errorCode == ScanCallback.SCAN_FAILED_ALREADY_STARTED) {
                String text = "Scan is already in progress";
                int duration = Toast.LENGTH_SHORT;
                Toast toast = Toast.makeText(getReactApplicationContext(), text, duration);
                toast.show();

            } else if (errorCode == ScanCallback.SCAN_FAILED_FEATURE_UNSUPPORTED) {
                String text = "Scanning BLE emitters is not supported by this device";
                int duration = Toast.LENGTH_LONG;
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


    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Scanner Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }
}
