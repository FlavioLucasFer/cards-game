export type RESOURCE_ALREADY_IN_USE = {
    type: 'RESOURCE_ALREADY_IN_USE',
    message: string,
};

export const resourceAlreadyInUse = (message: string): RESOURCE_ALREADY_IN_USE => {
    return {
        type: 'RESOURCE_ALREADY_IN_USE',
        message,
    };
};
