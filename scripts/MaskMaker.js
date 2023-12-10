export class MaskMaker {
    static applyMask(selector, mask) {
        $(selector).mask(`${mask}`);
    }

    static applyPhoneMask(selector) {
        $(selector).mask('+0 (000) 000-00-00');
    }
}