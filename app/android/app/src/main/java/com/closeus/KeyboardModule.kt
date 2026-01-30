package com.closeus

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class KeyboardModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "KeyboardModule"
    }

    @ReactMethod
    fun setAdjustPan() {
        val activity = reactContext.currentActivity ?: return
        activity.runOnUiThread {
            activity.window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN)
        }
    }

    @ReactMethod
    fun setAdjustResize() {
        val activity = reactContext.currentActivity ?: return
        activity.runOnUiThread {
            activity.window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE)
        }
    }

    @ReactMethod
    fun setAdjustNothing() {
        val activity = reactContext.currentActivity ?: return
        activity.runOnUiThread {
            activity.window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING)
        }
    }
}
