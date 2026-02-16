export interface Vulnerability {
  id: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface PortProfile {
  port: number;
  protocol: string;
  service: string;
  state: 'Open' | 'Closed' | 'Filtered';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  vulnerabilities?: Vulnerability[];
}

export interface ScanSession {
  target: string;
  timestamp: string;
  ports: PortProfile[];
  summary: string;
}

export enum Tab {
  SCANNER = 'SCANNER',
  LOG_ANALYZER = 'LOG_ANALYZER',
  ABOUT = 'ABOUT'
}