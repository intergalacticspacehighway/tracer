package com.tracer;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "tracer";
  }

  @Override
  protected void onDestroy() {
    Log.i("Destroy", "Main app destroy");
    Intent serviceIntent = new Intent(getApplicationContext(), BeaconTransmitterService.class);

    getApplicationContext().stopService(serviceIntent);

    super.onDestroy();
  }
}
