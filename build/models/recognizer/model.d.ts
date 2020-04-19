export declare const format: string;
export declare const generatedBy: string;
export declare const convertedBy: string;
export declare namespace modelTopology {
    export const keras_version: string;
    export const backend: string;
    export namespace model_config {
        export const class_name: string;
        export namespace config {
            export const name: string;
            export const layers: ({
                "class_name": string;
                "config": {
                    "name": string;
                    "trainable": boolean;
                    "batch_input_shape": number[];
                    "dtype": string;
                    "filters": number;
                    "kernel_size": number[];
                    "strides": number[];
                    "padding": string;
                    "data_format": string;
                    "dilation_rate": number[];
                    "activation": string;
                    "use_bias": boolean;
                    "kernel_initializer": {
                        "class_name": string;
                        "config": {
                            "seed": any;
                        };
                    };
                    "bias_initializer": {
                        "class_name": string;
                        "config": {};
                    };
                    "kernel_regularizer": any;
                    "bias_regularizer": any;
                    "activity_regularizer": any;
                    "kernel_constraint": any;
                    "bias_constraint": any;
                    "pool_size"?: undefined;
                    "rate"?: undefined;
                    "noise_shape"?: undefined;
                    "seed"?: undefined;
                    "units"?: undefined;
                };
            } | {
                "class_name": string;
                "config": {
                    "name": string;
                    "trainable": boolean;
                    "dtype": string;
                    "pool_size": number[];
                    "padding": string;
                    "strides": number[];
                    "data_format": string;
                    "batch_input_shape"?: undefined;
                    "filters"?: undefined;
                    "kernel_size"?: undefined;
                    "dilation_rate"?: undefined;
                    "activation"?: undefined;
                    "use_bias"?: undefined;
                    "kernel_initializer"?: undefined;
                    "bias_initializer"?: undefined;
                    "kernel_regularizer"?: undefined;
                    "bias_regularizer"?: undefined;
                    "activity_regularizer"?: undefined;
                    "kernel_constraint"?: undefined;
                    "bias_constraint"?: undefined;
                    "rate"?: undefined;
                    "noise_shape"?: undefined;
                    "seed"?: undefined;
                    "units"?: undefined;
                };
            } | {
                "class_name": string;
                "config": {
                    "name": string;
                    "trainable": boolean;
                    "dtype": string;
                    "filters": number;
                    "kernel_size": number[];
                    "strides": number[];
                    "padding": string;
                    "data_format": string;
                    "dilation_rate": number[];
                    "activation": string;
                    "use_bias": boolean;
                    "kernel_initializer": {
                        "class_name": string;
                        "config": {
                            "seed": any;
                        };
                    };
                    "bias_initializer": {
                        "class_name": string;
                        "config": {};
                    };
                    "kernel_regularizer": any;
                    "bias_regularizer": any;
                    "activity_regularizer": any;
                    "kernel_constraint": any;
                    "bias_constraint": any;
                    "batch_input_shape"?: undefined;
                    "pool_size"?: undefined;
                    "rate"?: undefined;
                    "noise_shape"?: undefined;
                    "seed"?: undefined;
                    "units"?: undefined;
                };
            } | {
                "class_name": string;
                "config": {
                    "name": string;
                    "trainable": boolean;
                    "dtype": string;
                    "rate": number;
                    "noise_shape": any;
                    "seed": any;
                    "batch_input_shape"?: undefined;
                    "filters"?: undefined;
                    "kernel_size"?: undefined;
                    "strides"?: undefined;
                    "padding"?: undefined;
                    "data_format"?: undefined;
                    "dilation_rate"?: undefined;
                    "activation"?: undefined;
                    "use_bias"?: undefined;
                    "kernel_initializer"?: undefined;
                    "bias_initializer"?: undefined;
                    "kernel_regularizer"?: undefined;
                    "bias_regularizer"?: undefined;
                    "activity_regularizer"?: undefined;
                    "kernel_constraint"?: undefined;
                    "bias_constraint"?: undefined;
                    "pool_size"?: undefined;
                    "units"?: undefined;
                };
            } | {
                "class_name": string;
                "config": {
                    "name": string;
                    "trainable": boolean;
                    "dtype": string;
                    "data_format": string;
                    "batch_input_shape"?: undefined;
                    "filters"?: undefined;
                    "kernel_size"?: undefined;
                    "strides"?: undefined;
                    "padding"?: undefined;
                    "dilation_rate"?: undefined;
                    "activation"?: undefined;
                    "use_bias"?: undefined;
                    "kernel_initializer"?: undefined;
                    "bias_initializer"?: undefined;
                    "kernel_regularizer"?: undefined;
                    "bias_regularizer"?: undefined;
                    "activity_regularizer"?: undefined;
                    "kernel_constraint"?: undefined;
                    "bias_constraint"?: undefined;
                    "pool_size"?: undefined;
                    "rate"?: undefined;
                    "noise_shape"?: undefined;
                    "seed"?: undefined;
                    "units"?: undefined;
                };
            } | {
                "class_name": string;
                "config": {
                    "name": string;
                    "trainable": boolean;
                    "dtype": string;
                    "units": number;
                    "activation": string;
                    "use_bias": boolean;
                    "kernel_initializer": {
                        "class_name": string;
                        "config": {
                            "seed": any;
                        };
                    };
                    "bias_initializer": {
                        "class_name": string;
                        "config": {};
                    };
                    "kernel_regularizer": any;
                    "bias_regularizer": any;
                    "activity_regularizer": any;
                    "kernel_constraint": any;
                    "bias_constraint": any;
                    "batch_input_shape"?: undefined;
                    "filters"?: undefined;
                    "kernel_size"?: undefined;
                    "strides"?: undefined;
                    "padding"?: undefined;
                    "data_format"?: undefined;
                    "dilation_rate"?: undefined;
                    "pool_size"?: undefined;
                    "rate"?: undefined;
                    "noise_shape"?: undefined;
                    "seed"?: undefined;
                };
            })[];
        }
    }
    export namespace training_config {
        export namespace loss {
            const class_name_1: string;
            export { class_name_1 as class_name };
            export namespace config_1 {
                export const reduction: string;
                const name_1: string;
                export { name_1 as name };
                export const from_logits: boolean;
            }
            export { config_1 as config };
        }
        export const metrics: string[];
        export const weighted_metrics: any;
        export const sample_weight_mode: any;
        export const loss_weights: any;
        export namespace optimizer_config {
            const class_name_2: string;
            export { class_name_2 as class_name };
            export namespace config_2 {
                const name_2: string;
                export { name_2 as name };
                export const learning_rate: number;
                export const decay: number;
                export const beta_1: number;
                export const beta_2: number;
                export const epsilon: number;
                export const amsgrad: boolean;
            }
            export { config_2 as config };
        }
    }
}
export declare const weightsManifest: {
    "paths": string[];
    "weights": {
        "name": string;
        "shape": number[];
        "dtype": string;
    }[];
}[];
