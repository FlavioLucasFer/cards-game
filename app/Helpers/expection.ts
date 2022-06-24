export type RESOURCE_ALREADY_IN_USE = {
    type: 'RESOURCE_ALREADY_IN_USE',
    message: string,
};

export type RESOURCE_NOT_BELONGS_TO = {
    type: 'RESOURCE_NOT_BELONGS_TO',
    message: string,
};

export type RESOURCE_NOT_FOUND = {
    type: 'RESOURCE_NOT_FOUND',
    message: string,
};

export const resourceAlreadyInUse = (message: string): RESOURCE_ALREADY_IN_USE => {
    return {
        type: 'RESOURCE_ALREADY_IN_USE',
        message,
    };
};

export const resourceNotBelongsTo = (message: string): RESOURCE_NOT_BELONGS_TO => {
    return {
        type: 'RESOURCE_NOT_BELONGS_TO',
        message,
    };
}

export const resourceNotFound = (message?: string): RESOURCE_NOT_FOUND => {
    return {
        type: 'RESOURCE_NOT_FOUND',
        message: message || 'Resource not found',
    };
}
