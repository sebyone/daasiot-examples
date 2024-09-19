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
  DinDataType,
  LinkDataType,
  LinkFormData,
  MapDataType,
  StatusDataType,
} from '@/types';
import axiosAuthInstance from '@/utils/api';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `http://158.220.97.43:3000/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const ConfigService = {
  /**
   * Recupera la configurazione completa del nodo locale
   * Promise<ConfigData> - Oggetto ConfigData con la configurazione completa del nodo locale
   */
  getDinLocal: async (): Promise<ConfigData> => {
    try {
      const response = await axiosAuthInstance.get('/config');
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
      await axiosAuthInstance.put('/config', data);
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
      await axiosAuthInstance.delete(`/config/links/${id}`);
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
      await axiosAuthInstance.delete(`/config/dins/${id}`);
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
      await axiosAuthInstance.post('/start');
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
      const response = await axiosAuthInstance.get('/links');
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
      const response = await axiosAuthInstance.get('/dins');
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
      const response = await axiosAuthInstance.post<LinkDataType>('/links', link);
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
  createMap: async (map: Omit<DinDataType, 'id'>) => {
    try {
      const response = await axiosAuthInstance.post<DinDataType>('/dins', map);
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
      const response = await axiosAuthInstance.get(`/links/${id}`);
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
      const response = await axiosAuthInstance.put(`/links/${id}`, formData);
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
      const response = await axiosAuthInstance.get(`/dins/${id}`);
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
  updateMap: async (id: number, mapData: DinDataType): Promise<void> => {
    try {
      const response = await axiosAuthInstance.put(`/dins/${id}`, mapData);
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
  sendPayload: async (din: number | null, status: boolean, value: number) => {
    try {
      const st = status ? 1 : 0;
      const va = value || 0;
      const response = await axiosAuthInstance.post(
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
};

export default ConfigService;
