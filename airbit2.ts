/**
 * Βασίλης Οικονόμου 7/2/2023
 * Ελληνικό Πρόσθετο για το Air:bit 2
 */

// Enums με αγγλικά ονόματα για μέγιστη συμβατότητα
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

//% weight=100 color=#00AEEF icon="\uf140" block="AirBit Ελληνικά"
namespace airbit2_GR {

    //% block="Αρχικοποίηση"
    export function initialize() {
        airbit.IMU_Start()
        basic.pause(100)
        airbit.PCA_Start()
        basic.pause(100)
        airbit.IMU_gyro_calibrate()
        basic.showIcon(IconNames.Happy)
    }

    //% block="Απογείωση"
    export function takeOff() {
        arm = 1
        for (let i = 0; i <= 65; i++) {
            throttle = i
            basic.pause(20)
        }
    }

    //% block="Προσγείωση"
    export function land() {
        for (let i = throttle; i >= 0; i--) {
            throttle = i
            basic.pause(30)
        }
        arm = 0
        airbit.MotorSpeed(0, 0, 0, 0)
        basic.showIcon(IconNames.No)
    }

    // Χρήση αγγλικών παραμέτρων (dir, distance) για να δουλέψει το combo box
    //% block="Κινήσου %dir για %distance εκατοστά"
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

    //% block="Προβολή Πληροφοριών"
    export function showInfo() {
        basic.clearScreen()
        airbit.smartBar(4, airbit.batteryLevel())
        let ledX = Math.map(imuRoll, -15, 15, 0, 4)
        let ledY = Math.map(imuPitch, -15, 15, 4, 0)
        led.plot(ledX, ledY)
    }

    //% block="Επίπεδο Μπαταρίας"
    export function batteryPercentage(): number {
        return airbit.batteryLevel()
    }
}
