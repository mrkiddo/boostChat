/**
 * Created by luojiawei on 16/9/24.
 */
var Vue = require('vue');
var template = require('../../templates/contactlist.handlebars');
var userService = require('../services/userService');

Vue.filter('avatarPath', function (avatarName) {
    avatarName = avatarName || 'default';
    return '/images/avatar/' + avatarName + '.jpg';
});

module.exports = Vue.extend({
    template: template(),
    props: ['cont', 'contIndex', 'userInfo', 'contInfo'],
    data: function () {
        return {
            selectedIndex: -1
        };
    },
    methods: {
        select: function (contactId, index, contactInfo, event) {
            this.selectedIndex = index;
            this.contIndex = contactId;
            this.contInfo = contactInfo;
        },
        updateSticky: function (contactId, index, event) {
            var self = this;
            var currentContactId = self.contIndex;
            self.cont[index].isSticky = !self.cont[index].isSticky;
            userService
                .updateContactSticky(self.userInfo.userid, contactId, self.cont[index].isSticky)
                .then(function (response) {
                    var data = response.data;
                    var updatedContactList = data.list;
                    self.cont = userService.sortContactlist(updatedContactList);
                    for(i = 0; i < self.cont.length; i++) {
                        if(self.cont[i].id == currentContactId) {
                            self.selectedIndex = i;
                        }
                    }
                });
        }
    }
});