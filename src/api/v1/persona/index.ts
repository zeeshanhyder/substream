import { Router } from 'express';
import createUserHandler from './create-user.post';
import createWatchSession from './create-watch-session.post';
import fetchAllUsers from './fetch-all-users.get';
import updateWatchHistory from './update-watch-history.post';
import fetchMediaWatchHistory from './fetch-media-watch-history.get';
import fetchUserMedia from './fetch-user-media';
import fetchUserWatchHistory from './fetch-user-watch-history.get';
import { logMounts } from '../../utils';
import fetchUserMediaById from './fetch-user-media-by-id.get';

const persona = Router();

persona.get('/users', fetchAllUsers);
persona.post('/user', createUserHandler);

persona.get('/:userId/watch/:mediaId', fetchMediaWatchHistory);
persona.get('/:userId/watch', fetchUserWatchHistory);
persona.get('/:userId/media', fetchUserMedia);
persona.get('/:userId/media/:mediaId', fetchUserMediaById);

persona.post('/:userId/watch/:mediaId', updateWatchHistory);
persona.post('/:userId/session', createWatchSession);

logMounts(persona, 'persona');

export default persona;
