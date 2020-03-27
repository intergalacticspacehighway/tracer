package com.tracer;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseSettings;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.os.ParcelUuid;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import org.altbeacon.beacon.Beacon;
import org.altbeacon.beacon.BeaconParser;
import org.altbeacon.beacon.BeaconTransmitter;
import org.altbeacon.beacon.Identifier;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

public class BeaconTransmitterService extends Service {
    public static final String CHANNEL_ID = "ForegroundServiceChannel";
    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String uuid = intent.getStringExtra("uuid");
        createNotificationChannel();
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, notificationIntent, 0);
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this, CHANNEL_ID);
        Notification notification = mBuilder
                .setContentTitle("Foreground Service")
                .setContentText(uuid)
                .setSmallIcon(R.drawable.redbox_top_border_background)
                .setContentIntent(pendingIntent)
                .build();
        startForeground(1, notification);

        // Transmitter

        BeaconParser beaconParser = new BeaconParser()
                .setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24");
        BeaconTransmitter beaconTransmitter = new BeaconTransmitter(getApplicationContext(), beaconParser);
        if(!beaconTransmitter.isStarted()){
        try {
            Log.i("BLE ",uuid);
            ParcelUuid pUuid = new ParcelUuid(UUID.fromString(uuid));
            int result = BeaconTransmitter.checkTransmissionSupported(getApplicationContext());
            if(result == BeaconTransmitter.SUPPORTED) {
                Log.d("BLE", "Beacon Transmission supported");

                Beacon beacon = new Beacon.Builder()
                        .setId1(uuid)
                        .setId2("1")
                        .setId3("2")
                        .setManufacturer(76)
                        .setTxPower(-59)
                        .build();

                beaconTransmitter.setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_BALANCED);
                beaconTransmitter.startAdvertising(beacon, new AdvertiseCallback() {

                    @Override
                    public void onStartFailure(int errorCode) {
                        Log.e("BLE", "Advertisement start failed with code: "+errorCode);
                    }

                    @Override
                    public void onStartSuccess(AdvertiseSettings settingsInEffect) {
                        Log.i("BLE", "Advertisement start succeeded.");
                    }
                });
            }

        } catch (Exception e) {
            Log.i("BLE",e.getMessage());
            e.printStackTrace();
        }
        }



        //do heavy work on a background thread
//        stopSelf();
        return START_NOT_STICKY;
    }
    @Override
    public void onDestroy() {
        BeaconParser beaconParser = new BeaconParser()
                .setBeaconLayout("m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24");
    Log.i("Destroy ","Service destroy");
        BeaconTransmitter beaconTransmitter = new BeaconTransmitter(getApplicationContext(), beaconParser);
        beaconTransmitter.stopAdvertising();
        stopForeground(true);
        stopSelf();
        super.onDestroy();
    }
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }
}
