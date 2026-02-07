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



// Δηλώσεις εξωτερικών μεταβλητών για να μην βγάζει λάθη το MakeCode

//declare let throttle: number;
//declare let arm: number;
//declare let last_radio_time: number;
//declare let motorTesting: boolean;
//declare let imuRoll: number;
//declare let imuPitch: number;
//declare let yaw: number;
//declare let pitch: number;





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
     * Σβήνει ακαριαία όλα τα μοτέρ και αφοπλίζει το drone.
     */
    //% block="Επείγουσα Διακοπή"
    //% color=#ff0000
    export function emergencyStop() {
        arm = 0 // Θέτει τη μεταβλητή arm σε 0 ακαριαία
        throttle = 0 // Μηδενίζει την ισχύ
        airbit.MotorSpeed(0, 0, 0, 0) // Στέλνει εντολή στα μοτέρ να σταματήσουν
        basic.showIcon(IconNames.No)
    }


    /**
    * ΑΠΟΓΕΙΩΣΗ
    */
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
        
        // 4. ΚΡΑΤΗΜΑ (Hover): Μένουμε στο 67 για να μην πέσει
        throttle = 67 
        basic.showIcon(IconNames.Yes)
    }


    //% block="Προσγείωση από τα %currentHeight εκατοστά"
    export function land(currentHeight: number) {
        // Κατεβαίνουμε σταδιακά από το hover (66) στο 50
        for (let j = 66; j >= 50; j--) {
            throttle = j
            basic.pause(currentHeight * 2) // Χρόνος καθόδου ανάλογα με το ύψος
        }
        arm = 0
        airbit.MotorSpeed(0, 0, 0, 0)
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
     * Ορίζει την ισχύ των μοτέρ (ταχύτητα) σε μια συγκεκριμένη τιμή.
     * @param speed Η επιθυμητή ταχύτητα από 0 έως 100
     */
    //% block="Όρισε ταχύτητα σε %speed"
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
        last_radio_time = control.millis() 
        
        // Άμεση εφαρμογή στα μοτέρ
        airbit.stabilisePid() 
    }


    /**
     * Επιστρέφει την τιμή της μεταβλητής throttle που χρησιμοποιείται στο main.ts
     */
    //% block="Τρέχουσα ταχύτητα"
    export function getCurrentThrottle(): number {
        return throttle
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
