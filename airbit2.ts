/**
 * Βασίλης Οικονόμου 7/2/2023
 * Ελληνικό Πρόσθετο για το Air:bit 2
 * Παρέχει απλοποιημένες εντολές στα Ελληνικά για τον έλεγχο του drone.
 */

// 1. Ορισμός Enums με διαφορετικό όνομα από τις παραμέτρους για να εμφανιστούν τα μενού
enum MoveDir {
    //% block="Μπροστά"
    Forward,
    //% block="Πίσω"
    Backward,
    //% block="Πάνω"
    Up,
    //% block="Κάτω"
    Down
}

enum TurnDir {
    //% block="Δεξιά"
    Right,
    //% block="Αριστερά"
    Left
}

//% weight=100 color=#00AEEF icon="\uf140" block="AirBit Ελληνικά"
namespace airbit2_GR {

    //% block="Αρχικοποίηση"
    export function αρχικοποίηση() {
        airbit.IMU_Start()
        basic.pause(100)
        airbit.PCA_Start()
        basic.pause(100)
        airbit.IMU_gyro_calibrate()
        basic.showIcon(IconNames.Happy)
    }

    //% block="Απογείωση"
    export function απογείωση() {
        arm = 1
        for (let i = 0; i <= 65; i++) {
            throttle = i
            basic.pause(20)
        }
    }

    //% block="Προσγείωση"
    export function προσγείωση() {
        for (let i = throttle; i >= 0; i--) {
            throttle = i
            basic.pause(30)
        }
        arm = 0
        airbit.MotorSpeed(0, 0, 0, 0)
        basic.showIcon(IconNames.No)
    }

    //% block="Κινήσου %κατεύθυνση για %cm εκατοστά"
    //% cm.defl=50
    export function κίνηση(κατεύθυνση: MoveDir, cm: number) {
        let ms = cm * 25;
        if (κατεύθυνση == MoveDir.Forward) {
            pitch = -10
        } else if (κατεύθυνση == MoveDir.Backward) {
            pitch = 10
        } else if (κατεύθυνση == MoveDir.Up) {
            throttle += 10
        } else if (κατεύθυνση == MoveDir.Down) {
            throttle -= 10
        }
        basic.pause(ms)
        pitch = 0
        throttle = Math.constrain(throttle, 0, 100)
    }

    //% block="Στρίψε %στροφή %μοίρες μοίρες"
    //% μοίρες.min=0 μοίρες.max=360
    export function στροφή(στροφή: TurnDir, μοίρες: number) {
        let στροφή_ms = μοίρες * 5;
        if (στροφή == TurnDir.Right) {
            yaw += μοίρες
        } else {
            yaw -= μοίρες
        }
        basic.pause(στροφή_ms)
    }

    //% block="Προβολή Πληροφοριών"
    export function προβολήΠληροφοριών() {
        basic.clearScreen()
        airbit.smartBar(4, airbit.batteryLevel())
        let ledX = Math.map(imuRoll, -15, 15, 0, 4)
        let ledY = Math.map(imuPitch, -15, 15, 4, 0)
        led.plot(ledX, ledY)
    }

    //% block="Επίπεδο Μπαταρίας"
    export function ποσοστόΜπαταρίας(): number {
        return airbit.batteryLevel()
    }
}
