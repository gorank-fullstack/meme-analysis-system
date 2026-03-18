import {
    // TChainName, 
    TQtType,
    // TChainQtKey, SUPPORT_QT,
} from "@gr/interface-base";

export function getQtMaxAge(qt: TQtType): number {
    switch (qt) {
        case '5m': return 300;
        case '1h': return 3600;
        case '6h': return 6 * 3600;
        case '24h': return 24 * 3600;
        default: return 0;
    }
}