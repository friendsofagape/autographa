import { readResourceMetadata } from '@/components/Resources/ResourceUtils/readResourceMetadata';

export default function readLocalResources(username, setSubMenuItems) {
  const parseData = [];
  const fs = window.require('fs');
  const path = require('path');
  const newpath = localStorage.getItem('userPath');
  const projectsDir = path.join(newpath, 'autographa', 'users', username, 'resources');// Read user resources
  const userResourceMetaPath = path.join(newpath, 'autographa', 'users', username, 'resources');
  fs.mkdirSync(path.join(newpath, 'autographa', 'users', username, 'resources'), {
    recursive: true,
  });
  readResourceMetadata(projectsDir, userResourceMetaPath, setSubMenuItems, parseData);

  const commonResourceDir = path.join(newpath, 'autographa', 'common', 'resources');// Read common resources
  const commonResourceMetaPath = path.join(newpath, 'autographa', 'common', 'resources');
  fs.mkdirSync(path.join(newpath, 'autographa', 'common', 'resources'), {
    recursive: true,
  });
  readResourceMetadata(commonResourceDir, commonResourceMetaPath, setSubMenuItems, parseData);
}
