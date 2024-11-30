import {Router} from 'express';
import {checkSource, create, list, stop} from '../controllers/stream.controller';
import {storageList, filesList, uploadFile, deleteFile} from '../controllers/storage.controller';
import {validateCreateStream} from '../schemas/stream.schema';

const router = Router();

router.post('/stream/create', validateCreateStream, create);
router.post('/stream/check-source', validateCreateStream, checkSource);
router.get('/stream/list', list);
router.get('/stream/stop/:id', stop);


router.get('/storage/list', storageList);
router.get('/storage/:name/list/', filesList);
router.post('/storage/:name/upload', uploadFile);
router.delete('/storage/:name/:file', deleteFile);



router.get('/health', (req, res) => {
    res.status(200).json({status: 'UP'});
});

export default router;
