enum PinModes {
    //% block="Input"
    INPUT = 0x1,
    //% block="Output"
    OUTPUT = 0x2,
}

enum Polarity {
    //% block="Ieverted"
    INVERTED = 0x1,
    //% block="Normal"
    NORMAL = 0x2,
}

enum DigitalValue{
    //% block="1"
    HIGH = 0x1,
    //% block="0"
    LOW = 0x2,
}

enum Extend_Pin {
    //% block="P0"
    extend_Pin0 = 0x01,
    //% block="P1"
    extend_Pin1 = 0x02,
    //% block="P2"
    extend_Pin2 = 0x04,
    //% block="P3"
    extend_Pin3 = 0x08,
    //% block="P4"
    extend_Pin4 = 0x10,
    //% block="P5"
    extend_Pin5 = 0x20,
    //% block="P6"
    extend_Pin6 = 0x40,
    //% block="P7"
    extend_Pin8 = 0x80,
}

//% color= #00ffff block="PCA9554"
namespace PCA9554 {
    const PCA9554_ADDRESS  = 0x38
    const PCA9554_REG_INP  = 0x00
    const PCA9554_REG_OUT  = 0x01
    const PCA9554_REG_POL  = 0x02
    const PCA9554_REG_CTRL = 0x03

    let mode_inp:number
    let mode_out:number
    let mode_pol:number
    let mode_ctrl:number

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2ccmd(addr: number, value: number) {
        let buf2 = pins.createBuffer(1)
        buf2[0] = value
        pins.i2cWriteBuffer(addr, buf2)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function pca9554_beging():void {

        mode_inp = i2cread(PCA9554_ADDRESS, PCA9554_REG_INP);
        mode_out = i2cread(PCA9554_ADDRESS, PCA9554_REG_OUT);
        mode_pol = i2cread(PCA9554_ADDRESS, PCA9554_REG_POL);
        mode_ctrl = i2cread(PCA9554_ADDRESS, PCA9554_REG_CTRL);
    }

    //% block="set extend pin %pin as %mode"
    export function pca9554_pinMode(pin: Extend_Pin, mode:PinModes):void {
        pca9554_beging();

        if (mode == 1) {
            mode_ctrl |= pin;
        } else if (mode == 2) {
            mode_ctrl &= ~pin;
        } 
        i2cwrite(PCA9554_ADDRESS, PCA9554_REG_CTRL, mode_ctrl);
    }

    //% block="set Polarity %pin as %polarity"
    export function pca9554_pinPolarity(pin: Extend_Pin, polarity: Polarity):void{
        pca9554_beging();
        if (polarity == 1) {
            mode_pol |= pin;
        } else if (polarity == 2) {
            mode_pol &= ~pin;
        } 
        i2cwrite(PCA9554_ADDRESS, PCA9554_REG_POL, mode_pol);
    }

    //% block="Write digital pin %pin as %val"
    export function pca9554_digitalWrite(pin: Extend_Pin, val:DigitalValue):void{
        pca9554_beging();
        
        if (val == 1) {
            mode_out |= pin;
        } else {
            mode_out &= ~pin;
        }
        i2cwrite(PCA9554_ADDRESS, PCA9554_REG_OUT, mode_out);
    }

    //% block="Read digital pin %pin"
    export function pca9554_digitalRead(pin:Extend_Pin):number {
        if((i2cread(PCA9554_ADDRESS, PCA9554_REG_INP) & pin) != 0){
            return 1
        }
        else {
            return 0
        }
    }
}
