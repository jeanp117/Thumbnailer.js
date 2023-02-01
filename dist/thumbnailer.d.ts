export declare const folderCLI: ({ input, width, height, quality, position, fit, prefix, format, output, }: {
    input: any;
    width: any;
    height: any;
    quality: any;
    position: any;
    fit: any;
    prefix: any;
    format: any;
    output: any;
}) => void;
export declare const singleCLI: ({ input, width, height, quality, position, fit, prefix, format, output, }: {
    input: any;
    width: any;
    height: any;
    quality: any;
    position: any;
    fit: any;
    prefix: any;
    format: any;
    output: any;
}) => void;
declare const thumbjs: {
    folder: (folder: any, sizes: any, options: any) => void;
    single: (filePath: any, { width, height, fit, format, quality, position, }: {
        width?: number;
        height?: number;
        fit?: string;
        format?: string;
        quality?: number;
        position?: string;
    }) => Promise<any>;
};
export default thumbjs;
