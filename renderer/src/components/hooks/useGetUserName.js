import { useEffect, useState } from 'react';
import localforage from 'localforage';
import { isElectron } from '@/core/handleElectron';
import * as logger from '../../logger';

// custom hook to fetch username from localforage
export const useGetUserName = (_username) => {
    const [username, setUsername] = useState('');
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                if (!username && isElectron()) {
                    const value = await localforage.getItem('userProfile');
                    setUsername(value?.username);
                }
            } catch (error) {
                logger.error('useGetUserName.js', error);
            }
        };
        fetchUserName();
    }, [username, _username]);
    return { username };
};
