/**
  * Daas-NodeJS 2023 (@) Sebyone Srl
 *
 * File: configService.ts
 * 
 * Servizio per la configurazione del sottosistema IoT
 * Configurare la rete sezione di configurazione Daas-IoT
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation and documentation
 *

 */
import {
  ConfigData,
  ConfigFormData,
  Device,
  DinDataType,
  DinFormData,
  DinLocalDataType,
  LinkDataType,
  LinkFormData,
  MapDataType,
  StatusDataType,
} from '@/types';
import axiosInstance from '@/utils/api';

const ConfigService = {
  /**
   * Recupera l'elenco di tutti i receivers
   * Promise<DinLocalDataType[]> - Array di oggetti DinLocalDataType
   */
  getAll: async (): Promise<DinLocalDataType[]> => {
    try {
      const response = await axiosInstance.get('/receivers');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  /**
   * Recupera la configurazione completa del nodo locale
   * Promise<ConfigData> - Oggetto ConfigData con la configurazione completa del nodo locale
   */
  getDinLocal: async (): Promise<ConfigData> => {
    try {
      const response = await axiosInstance.get('/receivers/1');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Aggiorna la configurazione del nodo locale
   * formData - Oggetto ConfigFormData con i nuovi dati di configurazione del nodo locale
   */
  update: async (formData: ConfigFormData): Promise<void> => {
    const { id, title, din_id, acpt_all, enable, sid, din, profileR, profileE, profileS, skey } = formData;

    const data: ConfigData = {
      id,
      title,
      din_id,
      acpt_all,
      enable,
      din: {
        id: din_id,
        sid,
        din,
        p_res: `${profileR}${profileE}${profileS}`,
        skey,
      },
    };

    try {
      await axiosInstance.put('/receivers/1', data);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Elimina un link specifico
   * @param id - ID del link da eliminare
   */
  deleteLink: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/receivers/1/links/${id}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Elimina un nodo mappato
   * @param id - ID della nodo mappato da eliminare
   */
  deleteMap: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/receivers/1/remotes/${id}`);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Avvia il sistema
   */
  start: async (): Promise<void> => {
    try {
      await axiosInstance.post('/start');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera tutti i link
   * Promise<LinkDataType[]> - Array di oggetti LinkDataType
   */
  getLinks: async (): Promise<LinkDataType[]> => {
    try {
      const response = await axiosInstance.get('/receivers/1/links');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera tutti i nodi mappati
   * Promise<MapDataType[]> - Array di oggetti MapDataType
   */
  getMaps: async (): Promise<MapDataType[]> => {
    try {
      const response = await axiosInstance.get('/receivers/1/remotes');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Crea un nuovo link
   * link - Oggetto LinkDataType senza l'ID (verrà generato dal server)
   * Promise<LinkDataType> - Oggetto LinkDataType del nuovo link creato
   */
  createLink: async (link: Omit<LinkDataType, 'id'>) => {
    try {
      const response = await axiosInstance.post<LinkDataType>('/receivers/1/links', link);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Crea un nuovo nodo mappato
   * map - Oggetto DinDataType senza l'ID (verrà generato dal server)
   * Promise<DinDataType> - Oggetto DinDataType della nuova mappa creata
   */
  createMap: async (map: Omit<DinFormData, 'id'>) => {
    try {
      const response = await axiosInstance.post<DinDataType>('/receivers/1/remotes', map);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera un link specifico tramite il suo ID
   * id - ID del link da recuperare
   * Promise<LinkDataType> - Oggetto LinkDataType del link richiesto
   */
  getLinkById: async (id: number): Promise<LinkDataType> => {
    try {
      const response = await axiosInstance.get(`/receivers/1/links/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Aggiorna un link esistente
   * id - ID del link da aggiornare
   * formData - Oggetto LinkDataType con i nuovi dati del link
   */
  updateLink: async (id: number, formData: LinkDataType): Promise<void> => {
    try {
      const response = await axiosInstance.put(`/receivers/1/links/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera un nodo mappato specifico tramite il suo ID
   * id - ID della mappa da recuperare
   * Promise<MapDataType> - Oggetto MapDataType del nodo mappato richiesto
   */
  getMapById: async (id: number): Promise<MapDataType> => {
    try {
      const response = await axiosInstance.get(`/receivers/1/remotes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Aggiorna un nodo mappato esistente
   * id - ID del nodo mappato da aggiornare
   * mapData - Oggetto DinDataType con i nuovi dati del nodo mappato
   */
  updateMap: async (id: number, mapData: DinFormData): Promise<void> => {
    try {
      const response = await axiosInstance.post(`/receivers/1/remotes/${id}`, mapData);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Invia un payload al sistema con i dati di accensione/spegnimento e dimmeraggio di un dispositivo
   * din - Numero DIN
   * status - Stato del dispositivo (acceso/spento)
   * value - Valore del dimmer da inviare
   */
  sendPayload: async (din: number | null, status: boolean, value: number | number[]) => {
    try {
      const st = status ? 1 : 0;
      const va = value || 0;
      const response = await axiosInstance.post(
        '/send',
        JSON.stringify({
          din: din,
          typeset: 3130,
          payload: { messagge: 'Hello, World!' },
        })
      );
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera lo stato del nodo
   * Promise<StatusDataType> - Oggetto con le informazioni sullo stato del nodo
   */
  getStatus: async (): Promise<StatusDataType> => {
    try {
      const response = await axiosInstance.get('/status');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera il numero di remotes
   * Promise<number> - Intero che rappresenta il numero di remotes
   */
  getRemotesCount: async (): Promise<number> => {
    try {
      const response = await axiosInstance.get<{ count: number }>('/remotes/count');
      return response.data.count;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera il numero di receivers
   * Promise<number> - Intero che rappresenta il numero di receivers
   */
  getReceiversCount: async (): Promise<number> => {
    try {
      const response = await axiosInstance.get<{ count: number }>('/receivers/count');
      return response.data.count;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera l'elenco di tutti i dispositivi
   * Promise<Device[]> - Array di oggetti Device
   */
  getDevices: async (): Promise<Device[]> => {
    try {
      const response = await axiosInstance.get('/devices');
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },

  /**
   * Recupera un dispositivo specifico tramite il suo ID
   * id - ID del dispositivo da recuperare
   * Promise<Device> - Oggetto Device del dispositivo richiesto
   */
  getDeviceById: async (id: number): Promise<Device> => {
    try {
      const response = await axiosInstance.get(`/devices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
};

export default ConfigService;
