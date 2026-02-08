/**
 * Βασίλης Οικονόμου 7/2/2026
 * Air:bit 2 - Πλήρες  Αρχείο (Συνδυασμένο)
 * Διατηρεί όλες τις αυθεντικές λειτουργίες και ενσωματώνει και τις ελληνικές εντολές.
 */




// ----------- ΜΕΤΑΒΛΗΤΕΣ  ---------

let yaw = 0
let radioReceivedTime = 0
let startTime = 0
let cpuTime = 0
let motorTesting = false

let mode = 0
let pitch = 0
let roll = 0

let expoFactor = 0
let expoSetting = 0
let motorD = 0
let motorB = 0
let motorC = 0
let motorA = 0
let yawD = 0
let yawP = 0
let rollPitchD = 0
let rollPitchI = 0
let rollPitchP = 0
let batterymVoltSmooth = 0
let gyroExists = false
let mcExists = false
let batteryVolt = 0
let imuYaw = 0
let baroExists = false


let imuPitch: number
let imuRoll: number
let arm: number
let throttle: number

let BATTERY_FACTOR = 5.94

let gyroReturnId = 0
let mcReturnId = 0
let calibratedRoll = 0
let calibratedPitch = 0
let throttleScaled = 0
let yawCorrection = 0
let pitchCorrection = 0
let rollCorrection = 0
let lastYawDiff = 0
let pitchDdiff = 0
let pitchDiff = 0
let rollDiff = 0
let accRollOffset = 0  //  Calibration offset of the Roll
let accPitchOffset = 0  //  Calibration offset of the Pitch
let soundStage = 0
let oldTime = 0
let aux = 0
let yawIdiff = 0
let yawDiff = 0
let rollDdiff = 0
let lastPitchDiff = 0
let lastRollDiff = 0
let pitchIdiff = 0
let rollIdiff = 0
let yawDdiff = 0
let stable = true
let interruptCounter = 0
let gyroZcalibration = 0
let gyroZ = 0
let gyroZdelta = 0
let gyroXcalibration = 0
let gyroX = 0
let gyroXdelta = 0
let looptime = 0
let gyroYcalibration = 0
let gyroY = 0
let gyroYdelta = 0
let accY = 0
let accRoll = 0
let accZ = 0
let accX = 0
let accPitch = 0
let batteryLev = 0
let last_radio_time: number;


let PCA_REG_LEDUOT = 8
let PCA_REG_SLAVEADR = 98
let PCA_REG_MODE1 = 0
let PCA_REG_MODE2 = 1
let PCA_pwm0 = 2
let PCA_pwm1 = 3
let PCA_pwm2 = 4
let PCA_pwm3 = 5
let PCA_return = 0
let BARO_return = 0
let pitchPdiff = 0
let rollPitchISmall = 0
let rollPdiff = 0
let gyroYangle = 0
let gyroXangle = 0
let gyroZangle = 0
let tuning = 0
let PCA_REG_MODE2_CONFIG = 5        // Non-inverted: Open Drain: = %00001(1), Totem: = %00101(5), Inverted: Totem = %10101(21), Open drain: = %10001(17)

let IMU_REG_CONFIG = 1          // 0x6b
let IMU_PWR_MGMT_1 = 107        // 0x6b
let IMU_PWR_MGMT_2 = 108        // 0x6B
let IMU_WHO_AM_I = 117              // 0x68
let IMU_SIGNAL_PATH_RESET = 105 // 0x6a
let IMU_USER_CTRL = 106
let IMU_GYRO_CONFIG = 27
let IMU_ACCEL_CONFIG = 28
let IMU_ACCEL_CONFIG_2 = 29
let IMU_REG_ADDRESS = 104
let BARO_REG_SLAVEADR = 99
let magicNumber = "P1.5,I0.5,D0.35,Y2.5"
magicNumber = "P1.2,I20,D0.2,Y2"
magicNumber = "P1.2,I0.015,D50,Yp20,Yi0.01"
magicNumber = "git:P1.3,I0.04,D18,Yp4,Yi0.02"
magicNumber = "P0.5,I0,D15,Yp3,Yi0"
//rollPitchP = 0.5
//rollPitchI = 0
//rollPitchD = 15

let motorSpeed = -1












// --- INITIALIZATION ---
mcExists = false
gyroExists = false
stable = true
let radioGroup = 1
imuPitch = 0
imuRoll = 0
batterymVoltSmooth = 3700
rollPitchP = 0.9
rollPitchI = 0.004
rollPitchD = 15
yawP = 5
yawD = 70
motorA = 0
motorC = 0
motorB = 0
motorD = 0
expoSetting = 2
expoFactor = 45 * 45 / (45 - 45 / expoSetting)

radio.setGroup(radioGroup)
i2crr.setI2CPins(DigitalPin.P2, DigitalPin.P1)
basic.pause(100)











/**
* ---------------------------Custom blocks  -----------------------------
* Use this file to define custom export functions and blocks.
* Read more at https://makecode.microbit.org/blocks/custom
*/

enum MyEnum {
    //% block="one"
    One,
    //% block="two"
    Two
}



/**
 * 
 */
//% weight=100 color=#0fbc11 icon=""
namespace airbit {


    /**
    * Draw a vertical bar with gradients for prescicion
    * X = 0..4 x position on screen, amount = 0..100
    */

    //% blockID=airbit_smart_bar
    //% block="Smart Bar $x $amount"
    //% group='Screen'
    //% x.min = 0 x.max=4
    //% amount.min = 0 amount.max = 100

    export function smartBar(x: number, amount: number) {
        for (let index = 0; index <= amount / 20; index++) {
            led.plot(x, 4 - index)
        }
        led.plotBrightness(x, 4 - Math.floor(amount / 20), 12.75 * (amount % 20))
    }

    /**
     * Initialise Barometer
     */

    //% blockID=airbit_start_baro
    //% block="Start Barometer"
    //% group='Control'
    export function baroStart() {
        // Soft reset
        pins.i2cWriteNumber(
            BARO_REG_SLAVEADR,
            32861,
            NumberFormat.UInt16BE,
            true
        )
        basic.pause(10)
        pins.i2cWriteNumber(
            BARO_REG_SLAVEADR,
            61384,
            NumberFormat.UInt16BE,
            true
        )
        BARO_return = pins.i2cReadNumber(BARO_REG_SLAVEADR, NumberFormat.UInt16LE, true)
        if (BARO_return) {
            basic.showString("B")
        } else {
            basic.showString("No Baro", 50)
        }
    }


    /**
     * Erase PID registers
     */

    //% blockID=airbit_clean_reg
    //% block="Clean Registers"
    //% group='Control'

    export function cleanReg() {
        rollDiff = 0
        pitchDiff = 0
        lastRollDiff = 0
        lastPitchDiff = 0
        lastYawDiff = 0
        rollIdiff = 0
        pitchIdiff = 0
        yawIdiff = 0
        yawDiff = 0
        yawDdiff = 0
        lastRollDiff = 0
        lastPitchDiff = 0
      
        pitchPdiff = 0
        rollPdiff = 0
        pitchDdiff = 0
        rollDdiff = 0
        imuYaw = 0
        gyroZdelta = 0
        yaw = 0
        rollCorrection = 0
        pitchCorrection = 0

    }

    //let batteryVoltage = 0
    //  let batterymVoltSmooth = 0
    /**
     * Battery level in %
     */
    //% blockID=airbit_battery_level
    //% block="Battery Level"
    //% group='Battery management'

    export function batteryLevel() {
        batteryCalculation()
        return Math.map(batterymVoltSmooth, 3400, 4200, 0, 100)
    }


    /**
    *   Battery calculation with smoothing (low pass filter)
    */

    //% blockID=airbit_battery_calculation
    //% block="Battery Calculation"
    //% group='Battery management'

    export function batteryCalculation() {
        batterymVoltSmooth = Math.round(pins.analogReadPin(AnalogPin.P0) * BATTERY_FACTOR * 0.1 + batterymVoltSmooth * 0.9)

    }

    /**
       Battery calculation (no smoothing) 
    */

    //% blockID=airbit_battery_calculation_simple
    //% block="Battery milliVolts"
    //% group='Battery management'
    export function batterymVolt() {
        return Math.round(pins.analogReadPin(AnalogPin.P0) * BATTERY_FACTOR)

    }




    /**
     * Read from the motor controller
     */

    //% blockID=airbit_read_pca
    //% block="Read Motor Controller"
    //% group='System'

    export function readPCA(num: number) {
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            num,
            NumberFormat.UInt8BE,
            true
        )
        return pins.i2cReadNumber(PCA_REG_SLAVEADR, NumberFormat.UInt8BE, false)
    }



    export function radioSend() {
        radio.sendValue("B", batterymVoltSmooth)
        radio.sendValue("G", input.acceleration(Dimension.Z))
        radio.sendValue("Te", input.temperature())
        radio.sendValue("Rd", Math.round(imuRoll))
        radio.sendValue("Pd", Math.round(imuPitch))
    }

    /*
        export function PCA_ReadMode2() {
            pins.i2cWriteNumber(
                PCA_REG_SLAVEADR,
                PCA_REG_MODE2,
                NumberFormat.UInt8BE,
                true
            )
            return pins.i2cReadNumber(PCA_REG_SLAVEADR, NumberFormat.UInt8BE, false)
        }
        */


    

    /**
     * Calculate the drone's Roll, Pitch and Roll angles from raw data.
     */

    //% blockID=airbit_calculate_angles
    //% block="Calculate Angles"
    //% group='Control'

    export function calculateAngles() {
        looptime = input.runningTime() - oldTime
        oldTime = input.runningTime()
        accPitch = (-57.295 * Math.atan2(accY, accZ)) - accPitchOffset
        accRoll = (-57.295 * Math.atan2(accX, accZ)) - accRollOffset
        //accRollTest = accRoll
        // Degrees away from desired angle
        gyroXdelta = (gyroX - gyroXcalibration) * looptime * -0.00000762939
        gyroYdelta = (gyroY - gyroYcalibration) * looptime * 0.00000762939
        gyroZdelta = (gyroZ - gyroZcalibration) * looptime * -0.00000762939
        imuRoll = (gyroYdelta + imuRoll) * 0.99 + accRoll * 0.01
        imuPitch = (gyroXdelta + imuPitch) * 0.99 + accPitch * 0.01
        // imuRoll = gyroYdelta + imuRoll
        // gyroYangle = gyroYdelta + gyroYangle
        // gyroXangle = gyroXdelta + gyroXangle
        imuYaw = gyroZdelta + imuYaw
        //serial.writeLine(""+imuYaw)
    }

    /** 
     * 
     * Plot a rotating dot
     * xPos and yPos is the center point 0..4
     * Radius 1..4 (size)
     * Speed -100..100, use negative value for counter clock rotation
    */
    //% blockID=airbit_rotation_dot
    //% block="Rotation dot $xPos $yPos $radius $speed"
    //% xPos.min=0 xPos.max=4 xPos.dfl=2
    //% yPos.min=0 yPos.max=4 yPos.dfl=2
    //% radius.min=1 radius.max=4 radius.dfl=2
    //% speed.min=-100 speed.max=100 speed.dfl=10
    //% group='Screen'

    export function rotateDot(xPos: number, yPos: number, radius: number, speed: number) {
        led.plot(xPos + 0.5 + (radius+0.5) * Math.cos(input.runningTime() / 10000 * 6.283 * speed), yPos + 0.5 + (radius+0.5) * Math.sin(input.runningTime() / 10000 * 6.283 * speed))
    }



    /**
        Control the individual speed of each motor.
     */
    //% blockID=airbit_motor_speed
    //% block="Motor Speed $m0 $m1 $m2 $m3"
    //% m0.min=0 m0.max=255
    //% m1.min=0 m1.max=255
    //% m2.min=0 m2.max=255
    //% m3.min=0 m3.max=255

    //% group='Control'

    export function MotorSpeed(m0: number, m1: number, m2: number, m3: number) {
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            PCA_pwm0 << 8 | m3,
            NumberFormat.UInt16BE,
            false
        )
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            PCA_pwm1 << 8 | m2,
            NumberFormat.UInt16BE,
            false
        )
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            PCA_pwm2 << 8 | m1,
            NumberFormat.UInt16BE,
            false
        )
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            PCA_pwm3 << 8 | m0,
            NumberFormat.UInt16BE,
            false
        )
    }




    /*
       Start and setup the Gyro/Accelereometer sensor
    */

    //% blockID=airbit_start_imu
    //% block="Start Gyro/Acc"
    //% group='Control'

    export function IMU_Start() {
        // Full reset chip (H_RESET, internal 20MHz clock)
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_PWR_MGMT_1 << 8 | 0x80,
            NumberFormat.UInt16BE,
            false
        )
        basic.pause(500)
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_WHO_AM_I,
            NumberFormat.UInt8BE,
            true
        )
        gyroReturnId = pins.i2cReadNumber(IMU_REG_ADDRESS, NumberFormat.Int16BE, false)
        // basic.showNumber(IMU_Return >> 8)
        basic.clearScreen()
        if (gyroReturnId >> 8 > 0) {
            basic.showString("G")
            gyroExists = true
        } else {
            basic.showString("NG", 50)
            gyroExists = false
        }
        // set clock to internal PLL
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_PWR_MGMT_1 << 8 | 0x01,
            NumberFormat.UInt16BE,
            false
        )
        // // place accel and gyro on standby
        // pins.i2cWriteNumber(
        // mpuAddress,
        // imu_PWR_MGMT_2 << 8 | 0x3f,
        // NumberFormat.UInt16BE,
        // false
        // )
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_SIGNAL_PATH_RESET << 8 | 0x07,
            NumberFormat.UInt16BE,
            false
        )
        // disable fifo
        // was 0x01, FIFO only available for serial
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_USER_CTRL << 8 | 0x00,
            NumberFormat.UInt16BE,
            false
        )
        // disable fifo
        // Filter setting: DLP_CFG = 0(250 Hz), 1(176 Hz)
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_USER_CTRL << 8 | 0x00,
            NumberFormat.UInt16BE,
            false
        )
        // Gyro filter setting to 0 (250 Hz), 1 (176 Hz),  2 (92 Hz), 3 (41 Hz)
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_REG_CONFIG << 8 | 0,
            NumberFormat.UInt16BE,
            false
        )
        // Acc filter setting to 3 (44.8 Hz), 4 (21,2 Hz), 5 (10.2 Hz)
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            IMU_ACCEL_CONFIG_2 << 8 | 5,
            NumberFormat.UInt16BE,
            false
        )
    }



    /*
      Write to the motor controller
    */

    //% blockID=airbit_write_pca
    //% block="Write PCA"
    //% group='System'

    export function PCA_Write(register: number, value: number) {
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            register << 8 | value,
            NumberFormat.UInt16BE,
            false
        )
    }


    /**
     * TODO: describe your export function here
     */
    //% block

    /*  export function PCA_Off() {
          PCA_Write(PCA_REG_MODE1, 128)
          // Inverted, Totem pole on:
          PCA_Write(PCA_REG_MODE2, 21)
          // LED0-LED3 individual brightness (no group pwm)
          pins.i2cWriteNumber(
              PCA_REG_SLAVEADR,
              PCA_REG_LEDUOT << 8 | 0,
              NumberFormat.UInt16BE,
              false
          )
      }
  
      */

    // basic.showNumber(0)



    //gyroX: number, gyroY: number, gyroZ: number, accY: number, accX: number, accZ: number

    /**
     * Read gyro and acceleration from sensor
     */

    //% blockID=airbit_read_imu
    //% block="Read Gyro/Acc"
    //% group='Control'

    export function IMU_sensorRead() {
        pins.i2cWriteNumber(
            IMU_REG_ADDRESS,
            67,
            NumberFormat.Int8LE,
            true
        )
        gyroX = pins.i2cReadNumber(104, NumberFormat.Int16BE, true)
        gyroY = pins.i2cReadNumber(104, NumberFormat.Int16BE, true)
        gyroZ = pins.i2cReadNumber(104, NumberFormat.Int16BE, false)
        pins.i2cWriteNumber(
            104,
            59,
            NumberFormat.Int8LE,
            true
        )
        accX = pins.i2cReadNumber(104, NumberFormat.Int16BE, true)
        accY = pins.i2cReadNumber(104, NumberFormat.Int16BE, true)
        accZ = pins.i2cReadNumber(104, NumberFormat.Int16BE, false)
    }



    // Mode2:
    // Totem pole:
    // Inverted = %10101(21)
    // Non-inverted = %00101(5)
    // 
    // Open Drain:
    // Inverted = %10001(17)
    // Non-inverted = %00001(1)

    /**
    * Setup motor controller
    */

    //% blockID=airbit_start_pca
    //% block="Start Motor Controller"
    //% group='Control'

    export function PCA_Start() {
        PCA_Write(PCA_REG_MODE1, 128)
        PCA_Write(PCA_REG_MODE2, PCA_REG_MODE2_CONFIG)
        // Mode2:Inverted, Totem pole on = %10101(21), Non-inverted = %00101(5)
        // Mode2:Inverted, Open drain = %10001(17), Non-inverted = %00001(1)
        PCA_Write(PCA_REG_LEDUOT, 170)

        MotorSpeed(0, 0, 0, 0)     // Zero out motor speed 
        // Self test to see if data reg can be read.
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            PCA_REG_MODE2,
            NumberFormat.UInt8BE,
            true
        )
        mcReturnId = pins.i2cReadNumber(PCA_REG_SLAVEADR, NumberFormat.UInt8BE, false)
        basic.clearScreen()
        if (mcReturnId) {
            basic.showString("M")
            mcExists = true
        } else {
            basic.showString("No PCA!", 50)
            mcExists = false
        }
    }




    /**
    * Calibrate the gyro
    */
    //% block

    /**
    * Calibrate the gyro and accelerometer
    */
    //% blockID=Calibrate Gyro / Acc
    //% block="Calibrate the offsets for gyro and accelerometer"



    //% blockID=airbit_calibrate_gyro
    //% block="Calibrate Gyro/Acc"
    //% group='Control'

    export function IMU_gyro_calibrate() {
        gyroXcalibration = 0
        gyroYcalibration = 0
        gyroZcalibration = 0
        basic.showString("C")
        for (let index = 0; index < 100; index++) {
            IMU_sensorRead()
            gyroXcalibration += gyroX
            gyroYcalibration += gyroY
            gyroZcalibration += gyroZ
            basic.pause(5)
        }
        gyroXcalibration = gyroXcalibration / 100
        gyroYcalibration = gyroYcalibration / 100
        gyroZcalibration = gyroZcalibration / 100
        accPitch = -57.295 * Math.atan2(accY, accZ)
        accRoll = -57.295 * Math.atan2(accX, accZ)
        accPitchOffset = accPitch
        accRollOffset = accRoll

        //accPitchOffset = 0
        //accRollOffset = 0

        basic.showIcon(IconNames.Yes)
    }




    /**
     * Use PID algorithm to generate the four motor speeds 
     */

    //% blockID=airbit_stabilise_pid
    //% block="Stabilise PID"
    //% group='Control'


    export function stabilisePid() {

        rollDiff = roll - imuRoll
        pitchDiff = pitch - imuPitch      // Reversing the pitch
        yawDiff = yaw - imuYaw
        rollDdiff = rollDiff - lastRollDiff
        pitchDdiff = pitchDiff - lastPitchDiff
        yawDdiff = yawDiff - lastYawDiff

        lastRollDiff = rollDiff
        lastPitchDiff = pitchDiff
        lastYawDiff = yawDiff

        let iRange = 5      //  Maximal error that will increase Roll and Pitch integral
        let iLimit = 4      //  Maximal correcton that can be added by integral
        let yawLimit = 50   //  Maximal yaw correction 
       
        if (throttle > 50) {    // Prevent windup before flight

            if (rollDiff > - iRange && rollDiff < iRange ){
                rollIdiff += rollDiff
            }
            if (pitchDiff > - iRange && pitchDiff < iRange) {
                pitchIdiff += pitchDiff
            }

        }

        let rollIcorrection = rollIdiff * rollPitchI
        let pitchIcorrection = pitchIdiff * rollPitchI

        rollIcorrection = Math.constrain(rollIcorrection, -iLimit, iLimit)     // Limit I (preventing it from growing out of proportions)
        pitchIcorrection = Math.constrain(pitchIcorrection, -iLimit, iLimit)

     
        rollCorrection = rollDiff * rollPitchP + rollIcorrection + rollDdiff * rollPitchD
        pitchCorrection = pitchDiff * rollPitchP + pitchIcorrection + pitchDdiff * rollPitchD
        //yawCorrection = yawDiff * yawP 
        yawCorrection = yawDiff * yawP + yawDdiff * yawD
        yawCorrection = Math.constrain(yawCorrection, -yawLimit, yawLimit)
        throttleScaled = throttle * 2.55

        //tuningOut = rollIdiff * rollPitchI
        //tuningOutA = yawDiff
        //tuningOutB = rollIcorrection

        // rollCorrection = 0
        motorA = Math.round(throttleScaled + rollCorrection + pitchCorrection + yawCorrection)
        motorB = Math.round(throttleScaled + rollCorrection - pitchCorrection - yawCorrection)
        motorC = Math.round(throttleScaled - rollCorrection + pitchCorrection - yawCorrection)
        motorD = Math.round(throttleScaled - rollCorrection - pitchCorrection + yawCorrection)
        motorA = Math.constrain(motorA, 0, 255)
        motorB = Math.constrain(motorB, 0, 255)
        motorC = Math.constrain(motorC, 0, 255)
        motorD = Math.constrain(motorD, 0, 255)
    }


    /**
     * Frame rate of pid loop
     */
    //% block

    export function fps() {

        return Math.round(1000 / looptime)
    }
    export function sounds() {
        if (arm && soundStage == 0) {
            soundExpression.giggle.playUntilDone()
            soundStage = 1
        }
        if (batteryLev < 50 && soundStage == 1) {
            soundExpression.slide.playUntilDone()
            soundStage = 2
        }
        if (batteryLev < 20 && soundStage == 2) {
            soundExpression.sad.playUntilDone()
            soundStage = 3
        }
    }
    input.onGesture(Gesture.ScreenDown, function () {
        stable = false
    })



    /**
     * TODO: describe your export function here
     * @param n describe parameter here, eg: 5
     * @param s describe parameter here, eg: "Hello"
     * @param e describe parameter here
     */
    //% block

    

    export function PCA_ReadMode1() {
        pins.i2cWriteNumber(
            PCA_REG_SLAVEADR,
            PCA_REG_MODE1,
            NumberFormat.UInt8BE,
            true
        )
        return pins.i2cReadNumber(PCA_REG_SLAVEADR, NumberFormat.UInt8BE, false)
    }

}

















/**
 * Βασίλης Οικονόμου 7/2/2023
 * Ελληνικό Πρόσθετο για το Air:bit 2
 */

enum MoveDirection {
    //% block="Μπροστά"
    Forward,
    //% block="Πίσω"
    Backward,
    //% block="Πάνω"
    Up,
    //% block="Κάτω"
    Down
}

enum TurnDirection {
    //% block="Δεξιά"
    Right,
    //% block="Αριστερά"
    Left
}



enum ThrottleAction {
    //% block="Αύξηση"
    Increase,
    //% block="Μείωση"
    Decrease
}




//% weight=100 color=#00AEEF icon="\uf140" block="AirBit Ελληνικά"
namespace airbit2_GR {

    //% block="Αρχικοποίηση"
    //% group='Μία φορά στην αρχή'
    export function initialize() {
        airbit.IMU_Start()
        basic.pause(100)
        airbit.PCA_Start()
        basic.pause(100)
        airbit.IMU_gyro_calibrate()
        basic.showIcon(IconNames.Happy)
    }

    /**
     * Σβήνει ακαριαία όλα τα μοτέρ και αφοπλίζει το drone.
     */
    //% block="Επείγουσα διακοπή"
    //% group='Πτήση'
    //% color=#ff0000
    export function emergencyStop() {
        arm = 0 // Θέτει τη μεταβλητή arm σε 0 ακαριαία
        throttle = 0 // Μηδενίζει την ισχύ
        airbit.MotorSpeed(0, 0, 0, 0) // Στέλνει εντολή στα μοτέρ να σταματήσουν
        basic.showIcon(IconNames.No)
    }

    /*
    /**
    * ΑΠΟΓΕΙΩΣΗ
    
    //% block="Απογείωση στα %targetHeight εκατοστά"
    //% targetHeight.defl=100
    export function takeOff(targetHeight: number) {
        arm = 1
        // 1. Σταδιακή άνοδος μέχρι το σημείο αποκόλλησης
        for (let i = 0; i <= 65; i++) {
            throttle = i
            basic.pause(30) 
        }
        
        // 2. ΙΣΧΥΡΗ ΩΘΗΣΗ: Ανεβάζουμε στο 83 για να σιγουρέψουμε την άνοδο
        throttle = 83 
        
        // 3. ΧΡΟΝΟΣ ΑΝΟΔΟΥ: Αυξάνουμε τον πολλαπλασιαστή στο 30 για το 1 μέτρο
        let risingTime = targetHeight * 30 
        basic.pause(risingTime)
        
        // 4. ΚΡΑΤΗΜΑ (Hover): ήταν 67 και το μεγάλωσαγια να μην πέσει
        throttle = 70 
        //basic.showIcon(IconNames.Yes)
    }

    */



    /**
    * ΑΠΟΓΕΙΩΣΗ - Ομαλή έκδοση
    */
    //% block="Απογείωση στα %targetHeight εκατοστά"
    //% group='Πτήση'
    //% targetHeight.defl=100
    export function takeOff(targetHeight: number) {
        arm = 1
        
        // 1. ΣΤΑΔΙΑΚΗ ΑΝΟΔΟΣ (Soft Start)
        // Ανεβαίνουμε ομαλά μέχρι το σημείο που το drone ετοιμάζεται να σηκωθεί
        for (let i = 0; i <= 65; i++) {
            throttle = i
            basic.pause(40) 
        }
        
        // 2. ΟΜΑΛΗ ΩΘΗΣΗ (Transition to Climb)
        // Αντί για throttle = 83, ανεβαίνουμε σταδιακά για να μην "κλωτσήσει"
        for (let i = 66; i <= 83; i++) {
            throttle = i
            basic.pause(20) // Γρήγορη αλλά ομαλή αύξηση
        }
        
        throttle = 84

        // 3. ΧΡΟΝΟΣ ΑΝΟΔΟΥ
        let risingTime = targetHeight * 30 
        basic.pause(risingTime)
        
        // 4. ΟΜΑΛΗ ΜΕΤΑΒΑΣΗ ΣΤΟ HOVER (Smooth Leveling)
        // Κατεβάζουμε σιγά-σιγά από το 83 στο 70 (hover) 
        // για να μην "βουτήξει" το drone μόλις φτάσει στο ύψος στόχο
        for (let i = 84; i >= 72; i--) {
            throttle = i
            basic.pause(40) // Δίνουμε χρόνο στους έλικες να σταθεροποιηθούν
        }
    }


    //% block="Προσγείωση από τα %currentHeight εκατοστά"
    //% group='Πτήση'
    export function land(currentHeight: number) {
        // Ξεκινάμε από το τρέχον throttle και κατεβαίνουμε μέχρι το 50
        // Χρησιμοποιούμε την τρέχουσα τιμή της μεταβλητής throttle ως σημείο εκκίνησης
        for (let j = throttle; j >= 50; j--) {
            throttle = j
            //airbit.MotorSpeed(throttle, throttle, throttle, throttle) // Ενημέρωση των μοτέρ
            
            // Ο χρόνος παύσης προσαρμόζεται ώστε η κάθοδος να είναι ομαλή
            // Αν το ύψος είναι μεγάλο, η κάθοδος διαρκεί περισσότερο
            basic.pause(currentHeight * 2) 
        }

        // Απενεργοποίηση μοτέρ και arming
        arm = 0
        throttle = 0
        airbit.MotorSpeed(0, 0, 0, 0)
    }




    /**
     *  1. Αυτή η συνάρτηση μόνο υπολογίζει
     * Εκτελεί όλες τις απαραίτητες μετρήσεις και υπολογισμούς για να μείνει το drone σταθερό.
     * Συγκεντρώνει τις εντολές: IMU_sensorRead, calculateAngles και stabilisePid.
     */
    //% block="Υπολογισμοί για σταθεροποίηση"
    //% group='Διαρκής αποτίμηση'
    export function stabilization() {
        // Διάβασμα αισθητήρων
        airbit.IMU_sensorRead()
        // Υπολογισμός γωνιών
        airbit.calculateAngles()
        // Σταθεροποίηση PID αν δεν είμαστε σε λειτουργία τεστ μοτέρ
        if (motorTesting == false) {
            airbit.stabilisePid()  // Εδώ γίνεται ο υπολογισμός
        }
    }



    // 2. Αυτή η συνάρτηση μόνο εκτελεί (χωρίς το PID πια)
    //% block="Εφαρμογή υπολογισμών ισχύος στα μοτέρ"
    //% group='Διαρκής αποτίμηση'
    export function BOapplyMotorPower() {
        if (arm && stable && (mcExists && gyroExists)) {
            if (throttle == 0) {
                airbit.MotorSpeed(5, 5, 5, 5); // Idle
            } else {
                airbit.MotorSpeed(motorA, motorB, motorC, motorD);
            }
        } else {
            airbit.MotorSpeed(0, 0, 0, 0);
        }
    }








    /**
     * Ορίζει την ισχύ των μοτέρ (ταχύτητα) σε μια συγκεκριμένη τιμή.
     * @param speed Η επιθυμητή ταχύτητα από 0 έως 100
     */
    //% block="Όρισε ταχύτητα σε %speed"
    //% group='Πτήση'
    //% speed.min=0 speed.max=100
    export function targetThrottle(speed: number) {
        // Θέτουμε τη μεταβλητή throttle απευθείας στην τιμή που θέλουμε
        throttle = speed
        
        // Περιορισμός τιμής μεταξύ 0 και 100 για απόλυτη ασφάλεια
        throttle = Math.constrain(throttle, 0, 100)
    }


    /**
     * Αυξάνει ή μειώνει την ισχύ των μοτέρ (ταχύτητα).
     */
    //% block="Ταχύτητα %action κατά %amount"
    //% group='Πτήση'
    //% amount.min=0 amount.max=100
    export function setThrottle(action: ThrottleAction, amount: number) {
        if (action == ThrottleAction.Increase) {
            throttle = throttle + amount
        } else if (action == ThrottleAction.Decrease) {
            throttle = throttle - amount
        }
        
        // Ασφάλεια: Περιορισμός τιμής
        throttle = Math.constrain(throttle, 45, 100)
        
        // Ενημέρωση χρόνου για να μην την αλλάξει το failsafe του main.ts
        //last_radio_time = control.millis() 
        radioReceivedTime= control.millis()
        
        // Άμεση εφαρμογή στα μοτέρ
        airbit.stabilisePid() 
    }


  

    //% block="Κινήσου %dir για %distance εκατοστά"
    //% group='Πτήση'
    //% distance.defl=50
    export function move(dir: MoveDirection, distance: number) {
        let ms = distance * 25;
        if (dir == MoveDirection.Forward) {
            pitch = -10
        } else if (dir == MoveDirection.Backward) {
            pitch = 10
        } else if (dir == MoveDirection.Up) {
            throttle += 10
        } else if (dir == MoveDirection.Down) {
            throttle -= 10
        }
        basic.pause(ms)
        pitch = 0
        throttle = Math.constrain(throttle, 0, 100)
    }

    //% block="Στρίψε %turnDir %degrees μοίρες"
    //% group='Πτήση'
    //% degrees.min=0 degrees.max=360
    export function turn(turnDir: TurnDirection, degrees: number) {
        let turn_ms = degrees * 5;
        if (turnDir == TurnDirection.Right) {
            yaw += degrees
        } else {
            yaw -= degrees
        }
        basic.pause(turn_ms)
    }

    //% block="Πληροφορίες πτήσης"
    //% group='Διαρκής αποτίμηση'
    export function showInfo() {
        basic.clearScreen()
        airbit.smartBar(4, airbit.batteryLevel())
        let ledX = Math.map(imuRoll, -15, 15, 0, 4)
        let ledY = Math.map(imuPitch, -15, 15, 4, 0)
        led.plot(ledX, ledY)
    }

    //% block="Ενημέρωση ισχύος μοτέρ"
    //% group='Διαρκής αποτίμηση'
    export function updateMotors() {
        if (arm && stable) {
            airbit.MotorSpeed(motorA, motorB, motorC, motorD)
        } else {
            airbit.MotorSpeed(0, 0, 0, 0)
        }
    }



    //% block="Υπολογισμός μπαταρίας"
    //% group='Διαρκής αποτίμηση'
    export function bobatteryCalculation() {
        batterymVoltSmooth = Math.round(pins.analogReadPin(AnalogPin.P0) * BATTERY_FACTOR * 0.1 + batterymVoltSmooth * 0.9)

    }
    

    //% block="Έλεγχος χαμηλής μπαταρίας με ηχητική προειδοποίηση"
    //% group='Διαρκής αποτίμηση'
    export function batteryAlarm() {
        let level = airbit.batteryLevel()
        // Αν το drone είναι οπλισμένο (πετάει) και η μπαταρία είναι κάτω από 20%
        if (level < 20 ) {
            music.setVolume(255)
            music.playTone(Note.C, music.beat(BeatFraction.Quarter))
            music.playTone(Note.G, music.beat(BeatFraction.Quarter))
        }
    }



    /**
     * Στέλνει τα δεδομένα πτήσης και μπαταρίας στο τηλεχειριστήριο.
     */
    //% block="Αποστολή Τηλεμετρίας στο χειριστήριο"
    //% group='Επικοινωνία'
    //% weight=80
    export function sendTelemetry() {
        radio.sendValue("p", rollPitchP)
        radio.sendValue("i", rollPitchI)
        radio.sendValue("d", rollPitchD)
        radio.sendValue("t", radioReceivedTime)
        radio.sendValue("R2", roll)
        radio.sendValue("yp", yawP)
        radio.sendValue("yd", yawD)
        radio.sendValue("v", batterymVoltSmooth)
        radio.sendValue("p0", pins.analogReadPin(AnalogPin.P0))
    }

 
    /**
     * Επιστρέφει την τιμή της μεταβλητής throttle που χρησιμοποιείται στο main.ts
     */
    //% block="Τρέχουσα ταχύτητα"
    //% group='Συντήρηση'
    export function getCurrentThrottle(): number {
        return throttle
    }


    //% block="Ποσοστό μπαταρίας %"
    //% group='Συντήρηση'
    export function bobaterypersent(): number {
        // Υπολογισμός ποσοστού: 3400mV = 0%, 4100mV = 100%
        let percent = Math.map(batterymVoltSmooth, 3400, 4100, 0, 100)
        return Math.constrain(Math.round(percent), 0, 100)
    }

    //% block="Επίπεδο μπαταρίας"
    //% group='Συντήρηση'
    export function batteryPercentage(): number {
        return airbit.batteryLevel()
    }

   
    //% block="milliVolts μπαταρίας"
    //% group='Συντήρηση'
    export function bobatterymVolt() {
        return Math.round(pins.analogReadPin(AnalogPin.P0) * BATTERY_FACTOR)

    }






}
















































//-------------MAIN ---------------------


function servo1_test () {
    pins.digitalWritePin(DigitalPin.P1, 1)
    control.waitMicros(1500 + roll * 10)
    pins.digitalWritePin(DigitalPin.P1, 0)
}
function JoystickDeadBand () {
    if (Math.abs(roll) < 5) {
        roll = 0
    }
    if (Math.abs(pitch) < 5) {
        pitch = 0
    }
}


function screen () {
    if (pins.analogReadPin(AnalogPin.P0) > 780) {
        if (pins.analogReadPin(AnalogPin.P0) > 950) {
            basic.showIcon(IconNames.Yes)
            basic.showString("Charging finished!")
        } else {
            basic.showLeds(`
                . . # . .
                . # # # .
                . # . # .
                . # . # .
                . # # # .
                `)
            basic.showLeds(`
                . . # . .
                . # # # .
                . # . # .
                . # # # .
                . # # # .
                `)
            basic.showLeds(`
                . . # . .
                . # # # .
                . # # # .
                . # # # .
                . # # # .
                `)
        }
    } else {
        if (mode == 0) {
            // ΕΔΩ Η ΑΛΛΑΓΗ: Αντικατάσταση του dots() με την ελληνική προβολή
            airbit2_GR.showInfo()
        }
        if (mode == 1) {
            led.plotBarGraph(
            airbit.batteryLevel(),
            100
            )
        }
        if (mode == 2) {
            basic.showNumber(airbit.batterymVolt())
        }
        if (mode == 3) {
            basic.showNumber(pins.analogReadPin(AnalogPin.P0))
        }
        if (mode == 4) {
            basic.showNumber(throttle)
        }
        if (mode == 5) {
            motorTest()
        }
        if (mode == 6) {
            basic.clearScreen()
            motorLed()
        }
    }
}


function mainLoop () {
    while (true) {
        /*
        // Read raw data from gyro and accelerometer
        airbit.IMU_sensorRead()
        // Find drone's absolute Roll, Pitch and Yaw angles with sensor fusion, gyro and accelerometer together.
        airbit.calculateAngles()
        */
        airbit2_GR.stabilization()
       
       
        basic.pause(1)
        lostSignalCheck()
        if (motorTesting == false) {
            // The "magic" algorithm that stabilises the drone based on setpoint angle and actual angle, finding the difference and chanring motor speed to compensate.
            airbit.stabilisePid()
        }
        // If upside down while armed, disable flying
        if (Math.abs(imuRoll) > 90 && arm) {
            stable = false
        }
        // Only start motors if armed, stable, motor controller and gyro is operating
        if (arm && stable && (mcExists && gyroExists)) {
            if (throttle == 0) {
                // Idle speed of motors
                airbit.MotorSpeed(
                5,
                5,
                5,
                5
                )
            } else {
                airbit.MotorSpeed(
                motorA,
                motorB,
                motorC,
                motorD
                )
            }
        } else {
            // Clear registers for error compensation algorithms, do not keep errors from past flight.
            airbit.cleanReg()
            if (motorTesting) {
                airbit.MotorSpeed(
                motorA,
                motorB,
                motorC,
                motorD
                )
            } else {
                airbit.MotorSpeed(
                0,
                0,
                0,
                0
                )
            }
        }
        cpuTime = input.runningTime() - startTime
        startTime = input.runningTime()
    }
}
input.onButtonPressed(Button.A, function () {
    mode += -1
    if (mode < 0) {
        mode = 6
    }
})

function radioSendData () {
    radio.sendValue("p", rollPitchP)
    radio.sendValue("i", rollPitchI)
    radio.sendValue("d", rollPitchD)
    radio.sendValue("t", radioReceivedTime)
    radio.sendValue("R2", roll)
    radio.sendValue("yp", yawP)
    radio.sendValue("yd", yawD)
    radio.sendValue("v", batterymVoltSmooth)
    radio.sendValue("p0", pins.analogReadPin(AnalogPin.P0))
    basic.pause(5000)
}
function gyroAccBubble () {
	
}
input.onButtonPressed(Button.AB, function () {
    mode = 0
})
input.onButtonPressed(Button.B, function () {
    mode += 1
    if (mode > 6) {
        mode = 0
    }
})
function motorLed () {
    basic.clearScreen()
    led.plotBrightness(0, 4, motorA)
    led.plotBrightness(0, 0, motorB)
    led.plotBrightness(4, 4, motorC)
    led.plotBrightness(4, 0, motorD)
    led.plot(Math.map(imuRoll, -15, 15, 0, 4), Math.map(imuPitch, -15, 15, 4, 0))
}
radio.onReceivedValue(function (name, value) {
    radioReceivedTime = input.runningTime()
    if (name == "P") {
        pitch = expo(value) / -3
        pitch = Math.constrain(pitch, -15, 15)
    }
    if (name == "A") {
        arm = value
    }
    if (name == "R") {
        roll = expo(value) / 3
        roll = Math.constrain(roll, -15, 15)
    }
    if (name == "T") {
        throttle = value
        throttle = Math.constrain(throttle, 0, 100)
        if (batterymVoltSmooth < 3400) {
            throttle = Math.constrain(throttle, 0, 75)
        }
    }
    if (name == "Y") {
        yaw += value * 0.1
    }
})
// smartBar(0, throttle)
// smartBar(4, airbit.batteryLevel())
function dots () {
    basic.clearScreen()
    led.plot(Math.map(roll, -15, 15, 0, 4), Math.map(pitch, -15, 15, 4, 0))
    led.plot(Math.map(yaw, -30, 30, 0, 4), 4)
    if (arm) {
        led.plot(0, 0)
    }
    airbit.smartBar(0, throttle)
    airbit.smartBar(4, airbit.batteryLevel())
}
function lostSignalCheck () {
    // Failsafe makes only sense if already flying
    if (throttle > 65 && arm) {
        if (input.runningTime() > radioReceivedTime + 3000) {
            roll = 0
            pitch = 0
            yaw = 0
            throttle = 65
        }
        if (input.runningTime() > radioReceivedTime + 8000) {
            roll = 0
            pitch = 0
            yaw = 0
            throttle = 0
            arm = 0
        }
    }
}
function motorTest () {
    motorA = 0
    motorB = 0
    motorC = 0
    motorD = 0
    motorTesting = true
    motorB = 5
    for (let index = 0; index < 50; index++) {
        basic.clearScreen()
        airbit.rotateDot(
        1,
        1,
        1,
        10
        )
        basic.pause(20)
    }
    motorB = 0
    motorD = 5
    for (let index = 0; index < 50; index++) {
        basic.clearScreen()
        airbit.rotateDot(
        3,
        1,
        1,
        -10
        )
        basic.pause(20)
    }
    motorD = 0
    motorC = 5
    for (let index = 0; index < 50; index++) {
        basic.clearScreen()
        airbit.rotateDot(
        3,
        3,
        1,
        10
        )
        basic.pause(20)
    }
    motorC = 0
    motorA = 5
    for (let index = 0; index < 50; index++) {
        basic.clearScreen()
        airbit.rotateDot(
        1,
        3,
        1,
        -10
        )
        basic.pause(20)
    }
    motorA = 0
    motorTesting = false
}
function expo (inp: number) {
    if (inp >= 0) {
        return inp / expoSetting + inp * inp / expoFactor
    } else {
        return inp / expoSetting - inp * inp / expoFactor
    }
}





/*


// Καλούμε την ελληνική αρχικοποίηση
airbit2_GR.initialize()


while (arm) {
    basic.showString("Disarm!")
}

basic.forever(function () {
    if (stable == false) {
        basic.showString("Tilted. Please reset.")
    } else if (batterymVoltSmooth > 3450) {
        screen()
    } else if (batterymVoltSmooth > 3400) {
        basic.showLeds(`
            . . # . .
            . # . # .
            . # . # .
            . # . # .
            . # # # .
            `)
    } else {
        basic.showLeds(`
            . . # . .
            . # . # .
            . # . # .
            . # . # .
            . # # # .
            `)
        basic.showLeds(`
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            . . . . .
            `)
    }
})

basic.forever(function () {
    radioSendData()
})
basic.forever(function () {
    airbit.batteryCalculation()
})
basic.forever(function () {
    mainLoop()
})
*/    
