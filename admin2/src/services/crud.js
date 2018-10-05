import lively from './lively';

class Crud {
    create(type, payload) {
        return lively.ajax({ url: `http://localhost:8000/api/${type}`, method: 'POST', data: payload });
    }

    update(type, payload) {
        return lively.ajax({ url: `http://localhost:8000/api/${type}`, method: 'PUT', data: payload });
    }

    delete(type, id) {
        return lively.ajax({ url: `http://localhost:8000/api/${type}/${id}`, method: 'DELETE' });
    }
    
    findOne(type, id) {
        return lively.ajax({ url: `http://localhost:8000/api/${type}/${id}` });
    }
    
    findAll(type) {
        return lively.ajax({ url: `http://localhost:8000/api/${type}` });
    }
}

export default new Crud();