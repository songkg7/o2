import { DateExtractionPattern } from '../docusaurus/DateExtractionPattern';

describe('SINGLE', () => {
  it('should match YYYY-MM-DD-my-blog-post-title.md', () => {
    const regex = DateExtractionPattern['SINGLE'].regexp;
    expect('o2-temp.2021-02-01-my-blog-post-title.md').toMatch(regex);
  });

  it('should replace YYYY-MM-DD-my-blog-post-title.md', () => {
    const replacer = DateExtractionPattern['SINGLE'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('2021-02-01-my-blog-post-title.md');
  });
});

describe('MDX', () => {
  it('should match YYYY-MM-DD-my-blog-post-title.mdx', () => {
    const regex = DateExtractionPattern['MDX'].regexp;
    expect('o2-temp.2021-02-01-my-blog-post-title.mdx').toMatch(regex);
  });

  it('should replace YYYY-MM-DD-my-blog-post-title.mdx', () => {
    const replacer = DateExtractionPattern['MDX'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('2021-02-01-my-blog-post-title.mdx');
  });
});

describe('SINGLE_FOLDER_INDEX', () => {
  it('should match YYYY-MM-DD-my-blog-post-title/index.md', () => {
    const regex = DateExtractionPattern['SINGLE_FOLDER_INDEX'].regexp;
    expect('o2-temp.2021-02-01-my-blog-post-title/index.md').toMatch(regex);
  });

  it('should replace YYYY-MM-DD-my-blog-post-title/index.md', () => {
    const replacer = DateExtractionPattern['SINGLE_FOLDER_INDEX'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('2021-02-01-my-blog-post-title/index.md');
  });
});

describe('FOLDER_NAMED_BY_DATE', () => {
  it('should match YYYY-MM-DD/my-blog-post-title.md', () => {
    const regex = DateExtractionPattern['FOLDER_NAMED_BY_DATE'].regexp;
    expect('o2-temp.2021-02-01/my-blog-post-title.md').toMatch(regex);
  });

  it('should replace YYYY-MM-DD/my-blog-post-title.md', () => {
    const replacer = DateExtractionPattern['FOLDER_NAMED_BY_DATE'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('2021-02-01/my-blog-post-title.md');
  });
});

describe('NESTED_FOLDERS_BY_DATE', () => {
  it('should match YYYY/MM/DD/my-blog-post-title.md', () => {
    const regex = DateExtractionPattern['NESTED_FOLDERS_BY_DATE'].regexp;
    expect('o2-temp.2021/02/01/my-blog-post-title.md').toMatch(regex);
  });

  it('should replace YYYY/MM/DD/my-blog-post-title.md', () => {
    const replacer = DateExtractionPattern['NESTED_FOLDERS_BY_DATE'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('2021/02/01/my-blog-post-title.md');
  });
});

describe('PARTIALLY_NESTED_FOLDERS_BY_DATE', () => {
  it('should match YYYY/MM-DD/my-blog-post-title.md', () => {
    const regex = DateExtractionPattern['PARTIALLY_NESTED_FOLDERS_BY_DATE'].regexp;
    expect('o2-temp.2021/02-01/my-blog-post-title.md').toMatch(regex);
  });

  it('should replace YYYY/MM-DD/my-blog-post-title.md', () => {
    const replacer = DateExtractionPattern['PARTIALLY_NESTED_FOLDERS_BY_DATE'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('2021/02-01/my-blog-post-title.md');
  });
});

describe('NESTED_FOLDERS_INDEX', () => {
  it('should match YYYY/MM/DD/my-blog-post-title/index.md', () => {
    const regex = DateExtractionPattern['NESTED_FOLDERS_INDEX'].regexp;
    expect('o2-temp.2021/02/01/my-blog-post-title/index.md').toMatch(regex);
  });

  it('should replace YYYY/MM/DD/my-blog-post-title/index.md', () => {
    const replacer = DateExtractionPattern['NESTED_FOLDERS_INDEX'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('2021/02/01/my-blog-post-title/index.md');
  });
});

describe('DATE_IN_MIDDLE_OF_PATH', () => {
  it('should match category/YYYY/MM-DD-my-blog-post-title.md', () => {
    const regex = DateExtractionPattern['DATE_IN_MIDDLE_OF_PATH'].regexp;
    expect('o2-temp.category/2021/02-01-my-blog-post-title.md').toMatch(regex);
  });

  it('should replace category/YYYY/MM-DD-my-blog-post-title.md', () => {
    const replacer = DateExtractionPattern['DATE_IN_MIDDLE_OF_PATH'].replacer;
    expect(replacer('2021', '02', '01', 'my-blog-post-title')).toBe('category/2021/02-01-my-blog-post-title.md');
  });
});
