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
    export function initialize() {
        airbit.IMU_Start()
        basic.pause(100)
        airbit.PCA_Start()
        basic.pause(100)
        airbit.IMU_gyro_calibrate()
        basic.showIcon(IconNames.Happy)
    }

    /**
     * Απογείωση σε συγκεκριμένο ύψος.
     * @param targetHeight Το επιθυμητό ύψος σε εκατοστά (cm)
     */
    //% block="Απογείωση στα %targetHeight εκατοστά"
    //% targetHeight.defl=50
    export function takeOff(targetHeight: number) {
        arm = 1
        // Σταδιακή αύξηση throttle για ομαλή αποκόλληση από το έδαφος
        for (let i = 0; i <= 65; i++) {
            throttle = i
            basic.pause(20)
        }
        
        // Υπολογισμός επιπλέον χρόνου ανόδου βάσει των εκατοστών
        // (Η αναλογία 20ms ανά cm είναι μια αρχική εκτίμηση)
        let risingTime = targetHeight * 20
        throttle = 75 // Ισχύς ανόδου
        basic.pause(risingTime)
        
        // Επαναφορά σε throttle αιώρησης (hover)
        throttle = 65 
    }


    /**
     * Προσγείωση από το τρέχον ύψος.
     * @param currentHeight Το τρέχον ύψος σε εκατοστά (cm)
     */
    //% block="Προσγείωση από τα %currentHeight εκατοστά"
    //% currentHeight.defl=50
    export function land(currentHeight: number) {
        // Υπολογισμός χρόνου καθόδου βάσει του ύψους
        let landingTime = currentHeight * 30
        
        throttle = 55 // Χαμηλή ισχύς για ελεγχόμενη κάθοδο
        basic.pause(landingTime)
        
        // Σβήσιμο κινητήρων
        arm = 0
        airbit.MotorSpeed(0, 0, 0, 0)
        basic.showIcon(IconNames.No)
    }


    /**
     * Εκτελεί όλες τις απαραίτητες μετρήσεις και υπολογισμούς για να μείνει το drone σταθερό.
     * Συγκεντρώνει τις εντολές: IMU_sensorRead, calculateAngles και stabilisePid.
     */
    //% block="Σταθεροποίηση"
    export function stabilization() {
        // Διάβασμα αισθητήρων
        airbit.IMU_sensorRead()
        // Υπολογισμός γωνιών
        airbit.calculateAngles()
        // Σταθεροποίηση PID αν δεν είμαστε σε λειτουργία τεστ μοτέρ
        if (motorTesting == false) {
            airbit.stabilisePid()
        }
    }





    /**
     * Αυξάνει ή μειώνει την ισχύ των μοτέρ (ταχύτητα).
     * @param action Αύξηση ή Μείωση
     * @param amount Τιμή από 0 έως 100
     */
    //% block="Ταχύτητα %action κατά %amount"
    //% amount.min=0 amount.max=100
    export function setThrottle(action: ThrottleAction, amount: number) {
        if (action == ThrottleAction.Increase) {
            throttle += amount
        } else if (action == ThrottleAction.Decrease) {
            throttle -= amount
        }
        // Περιορισμός τιμής για ασφάλεια πτήσης
        throttle = Math.constrain(throttle, 0, 100)
    }




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
