declare class TrackCodePlugin {
    constructor(options?: {
        [key: string]: Function;
    });
    apply(complier: any): void;
}
export = TrackCodePlugin;
