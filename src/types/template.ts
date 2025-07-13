export type Template = {
    template_id?: number,
    uid?: number,
    t_body: string,
    t_key: string,
}

export type ListOfTemplates = {
    templates: Template[];
}

export type TemplateKeyValue = {
    t_key?: string,
    t_value?: string,
    onValueChange?: (parameter1: string, parameter2: string) => void;
    isInvalid?: boolean;
}