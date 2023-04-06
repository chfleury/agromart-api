'use strict';

async function setPublicPermissions(newPermissions, publicRole) {
  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) => {
      return strapi.query("plugin::users-permissions.permission").create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      });
    });
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}
async function boostrapPermissions(){
  const publicRole = await strapi
  .query("plugin::users-permissions.role")
  .findOne({
    where: {
      type: "public",
    },
  });
  await setPublicPermissions({
    'devices': [ 'findUserExpoPushToken','update' ], 
  }, publicRole );
};
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register( strapi ) {
    
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */


  bootstrap(strapi) {
    boostrapPermissions();
  },
};
