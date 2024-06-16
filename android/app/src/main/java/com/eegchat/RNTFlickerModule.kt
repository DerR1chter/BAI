package com.eegchat;

import android.os.Handler;
import android.os.Looper;
import android.view.View;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.uimanager.UIManagerModule;
import android.util.Log;
import java.util.Timer;
import java.util.TimerTask;

class RNTFlickerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val handler: Handler = Handler(Looper.getMainLooper())
    private var flickerTimer: Timer? = null
    private var isFlickering: Boolean = false
    private var isVisible: Boolean = true // Track current visibility state

    override fun getName(): String {
        return "RNTFlickerModule"
    }

    @ReactMethod
    fun startFlickering(viewId: Int, frequency: Int, callback: Callback) {
        val interval = 1000.0 / frequency / 2.0 
        Log.d("RNTFlickerModule", "Start flickering with frequency: $frequency Hz and interval: $interval ms")

        if (flickerTimer != null) {
            flickerTimer?.cancel()
        }

        isFlickering = true

        flickerTimer = Timer()
        flickerTimer?.schedule(object : TimerTask() {
            override fun run() {
                if (isFlickering) {
                    reactApplicationContext.getNativeModule(UIManagerModule::class.java)
                        ?.addUIBlock { nativeViewHierarchyManager ->
                            val view = nativeViewHierarchyManager.resolveView(viewId)
                            if (view != null) {
                                view.visibility = if (isVisible) View.INVISIBLE else View.VISIBLE
                                isVisible = !isVisible // Toggle visibility state
                                Log.d("RNTFlickerModule", "Flickering: Visibility set to " + (if (isVisible) "VISIBLE" else "INVISIBLE"))
                            }
                        }
                }
            }
        }, 0, (interval / 2).toLong()) // Start immediately and repeat every half interval

        callback.invoke(null, "Flickering started with frequency: $frequency Hz")
    }

    @ReactMethod
    fun stopFlickering(viewId: Int, callback: Callback) {
        Log.d("RNTFlickerModule", "Stop flickering")
        isFlickering = false
        if (flickerTimer != null) {
            flickerTimer?.cancel()
        }
        reactApplicationContext.getNativeModule(UIManagerModule::class.java)
            ?.addUIBlock { nativeViewHierarchyManager ->
                val view = nativeViewHierarchyManager.resolveView(viewId)
                view?.visibility = View.VISIBLE
                Log.d("RNTFlickerModule", "Flickering stopped: Visibility set to VISIBLE")
            }
        callback.invoke(null, "Flickering stopped")
    }
}