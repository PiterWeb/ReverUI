import UIClass from "../UI";

declare global {
    class UI {
        static createElement(): typeof UIClass.createElement;
        static createFragment(): typeof UIClass.createFragment;
    }
}
