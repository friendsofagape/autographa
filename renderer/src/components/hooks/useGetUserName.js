import { useEffect, useState } from 'react';
import localforage from 'localforage';
import { isElectron } from '@/core/handleElectron';
import { useRouter } from 'next/router';
import * as logger from '../../logger';

// custom hook to fetch username from localforage
export const useGetUserName = (_username) => {
    const [username, setUsername] = useState('');
    const router = useRouter()
    useEffect(() => {
        const fetchUserName = async () => {
            try {
                if (!username && isElectron()) {
                    const value = await localforage.getItem('userProfile');
                    if (value?.username) {
                        setUsername(value?.username)
                    }else{
                        localForage.removeItem('sessionToken');
                        localForage.removeItem('userProfile');
                        router.push('/')
                    }
                }
            } catch (error) {
                logger.error('useGetUserName.js', error);
            }
        };
        fetchUserName();
    }, [username, _username]);
    return { username };
};
