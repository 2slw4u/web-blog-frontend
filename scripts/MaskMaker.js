export class MaskMaker {
    static applyMask(element, mask) {
        $(elm).mask(`${mask}`);
    }

    static applyPhoneMask(element) {
        $(element).mask('+0 (000) 000-00-00');
    }
}