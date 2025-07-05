export type Email = {
    eid?: number;               
    uid?: number;               
    subject: string;            
    body: string;               
    is_sent?: boolean;          
    to_email: string;           
    cc_email?: string;          
    bcc_email?: string;         
    send_at?: string;
};
