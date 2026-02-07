/**
 * Βασίλης Οικονόμου 7/2/2023
 * Ελληνικό Πρόσθετο για το Air:bit 2
 * Παρέχει απλοποιημένες εντολές στα Ελληνικά για τον έλεγχο του drone.
 */

//% weight=100 color=#00AEEF icon="\uf140" block="AirBit Ελληνικά"
namespace airbit2_GR {

    /**
     * Αρχικοποίηση του drone. Προετοιμάζει τους αισθητήρες και καλιμπράρει το γυροσκόπιο.
     * Το drone πρέπει να είναι σε επίπεδη επιφάνεια!
     */
    //% block="Αρχικοποίηση"
    export function αρχικοποίηση() {
        airbit.IMU_Start()
        basic.pause(100)
        airbit.PCA_Start()
        basic.pause(100)
        airbit.IMU_gyro_calibrate()
        basic.showIcon(IconNames.Happy)
    }

    /**
     * Απογείωση και σταθεροποίηση.
     */
    //% block="Απογείωση"
    export function απογείωση() {
        arm = 1
        // Σταδιακή αύξηση ισχύος για ομαλή απογείωση
        for (let i = 0; i <= 65; i++) {
            throttle = i
            basic.pause(20)
        }
    }

    /**
     * Προσγείωση του drone με σταδιακή μείωση της ισχύος.
     */
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

    /**
     * Κίνηση προς μια κατεύθυνση.
     * @param cm εκατοστά κίνησης (εκτίμηση βάσει χρόνου/ισχύος)
     */
    //% block="Κινήσου $κατεύθυνση για $cm εκατοστά"
    //% cm.defl=50
    export function κίνηση(κατεύθυνση: Κατεύθυνση, cm: number) {
        let ms = cm * 25; // Χονδρική εκτίμηση: 25ms ανά εκατοστό
        
        if (κατεύθυνση == Κατεύθυνση.Forward) {
            pitch = -10 // Κλίση μπροστά
        } else if (κατεύθυνση == Κατεύθυνση.Backward) {
            pitch = 10  // Κλίση πίσω
        } else if (κατεύθυνση == Κατεύθυνση.Up) {
            throttle += 10 // Αύξηση ώσης
        } else if (κατεύθυνση == Κατεύθυνση.Down) {
            throttle -= 10 // Μείωση ώσης
        }
        
        basic.pause(ms)
        
        // Επαναφορά σε επίπεδη πτήση
        pitch = 0
        throttle = Math.constrain(throttle, 0, 100)
    }

    /**
     * Στροφή του drone γύρω από τον άξονά του (Yaw).
     * @param μοίρες μοίρες στροφής
     */
    //% block="Στρίψε $στροφή $μοίρες μοίρες"
    //% μοίρες.min=0 μοίρες.max=360
    export function στροφή(στροφή: ΔεξιάΑριστερά, μοίρες: number) {
        let στροφή_ms = μοίρες * 5; // Εκτίμηση χρόνου περιστροφής
        if (στροφή == ΔεξιάΑριστερά.Right) {
            yaw += μοίρες
        } else {
            yaw -= μοίρες
        }
        basic.pause(στροφή_ms)
    }

    /**
     * Εμφανίζει στην οθόνη LED την κατάσταση του drone.
     */
    //% block="Προβολή Πληροφοριών"
    export function προβολήΠληροφοριών() {
        basic.clearScreen()
        // Μπάρα μπαταρίας
        airbit.smartBar(4, airbit.batteryLevel())
        // Κουκίδα κλίσης (Pitch/Roll)
        let ledX = Math.map(imuRoll, -15, 15, 0, 4)
        let ledY = Math.map(imuPitch, -15, 15, 4, 0)
        led.plot(ledX, ledY)
    }

    /**
     * Επιστρέφει το ποσοστό της μπαταρίας.
     */
    //% block="Επίπεδο Μπαταρίας"
    export function ποσοστόΜπαταρίας(): number {
        return airbit.batteryLevel()
    }

    export enum Κατεύθυνση {
        //% block="Μπροστά"
        Forward,
        //% block="Πίσω"
        Backward,
        //% block="Πάνω"
        Up,
        //% block="Κάτω"
        Down
    }

    export enum ΔεξιάΑριστερά {
        //% block="Δεξιά"
        Right,
        //% block="Αριστερά"
        Left
    }
}