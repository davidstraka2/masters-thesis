interface BookingServiceInfo {
    version: string; // Resource SemVer version
    extensions?: {
        [key: string]: string; // Pairs of extension ID
                               // and its SemVer version
    };
}
